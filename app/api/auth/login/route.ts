import { NextRequest, NextResponse } from "next/server";
import {
  LOGIN_BODY_LIMIT, parseLoginRequest, type AccessFailureCode,
} from "../../../../lib/access/backend-auth-contract";
import { createBackendAuthHttp } from "../../../../lib/access/backend-auth-http";
import {
  createServerSession, SESSION_COOKIE_NAME,
} from "../../../../lib/access/server-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const fail = (code: AccessFailureCode, status: number) =>
  NextResponse.json({ ok: false, code }, { status, headers });

const statusFor = (code: AccessFailureCode): number => ({
  UNAUTHENTICATED: 401, FORBIDDEN: 403, BODY_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415, INVALID_INPUT: 422,
  UNAVAILABLE: 503, INCONCLUSIVE_PROTOCOL: 502,
})[code];

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");

  if (!origin || origin !== url.origin) return fail("FORBIDDEN", 403);
  if (url.search || request.headers.has("content-encoding")) {
    return fail("INVALID_INPUT", 400);
  }

  const length = request.headers.get("content-length");
  if (length !== null &&
      (!/^\d+$/.test(length) || Number(length) > LOGIN_BODY_LIMIT)) {
    return fail("BODY_TOO_LARGE", 413);
  }

  const contentType = request.headers.get("content-type");
  if (!contentType ||
      !/^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?\s*$/i.test(contentType)) {
    return fail("UNSUPPORTED_MEDIA_TYPE", 415);
  }

  let bytes: Uint8Array;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail("INVALID_INPUT", 422);

    const chunks: Uint8Array[] = [];
    let total = 0;

    try {
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        total += next.value.byteLength;
        if (total > LOGIN_BODY_LIMIT) return fail("BODY_TOO_LARGE", 413);
        chunks.push(next.value);
      }
    } finally {
      try { await reader.cancel(); } catch { /* ignore */ }
      reader.releaseLock();
    }

    bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
  } catch {
    return fail("INVALID_INPUT", 422);
  }

  const parsed = parseLoginRequest(bytes, contentType);
  if (!parsed.ok) return fail(parsed.code, statusFor(parsed.code));

  const backendOrigin = process.env.ZEVYL_AUTH_BACKEND_ORIGIN;
  if (!backendOrigin) return fail("UNAVAILABLE", 503);

  try {
    const backend = createBackendAuthHttp({ backendOrigin });
    const authenticated = await backend.login(parsed.value);
    if (!authenticated.ok) {
      return fail(authenticated.code, statusFor(authenticated.code));
    }

    const token = authenticated.value.access_token;

    // FastAPI /me is authoritative for token validity and identity.
    const identity = await backend.me(token);
    if (!identity.ok) {
      return fail(identity.code, statusFor(identity.code));
    }

    const session = createServerSession(token);
    if (!session) return fail("UNAVAILABLE", 503);

    const response = NextResponse.json(
      { ok: true, value: identity.value },
      { status: 200, headers },
    );

    response.cookies.set(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.max(
        1, Math.ceil((session.expiresAtMs - Date.now()) / 1000),
      ),
    });

    return response;
  } catch {
    return fail("UNAVAILABLE", 503);
  }
}