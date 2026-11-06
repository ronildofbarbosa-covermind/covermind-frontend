import { NextRequest, NextResponse } from "next/server";
import { type AccessFailureCode } from "../../../../lib/access/backend-auth-contract";
import { createBackendAuthHttp } from "../../../../lib/access/backend-auth-http";
import {
  getServerSession, revokeServerSession, SESSION_COOKIE_NAME,
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

export async function GET(request: NextRequest) {
  if (new URL(request.url).search) return fail("INVALID_INPUT", 400);

  // Browser-supplied Bearer tokens are no longer accepted.
  if (request.headers.has("authorization")) {
    return fail("UNAUTHENTICATED", 401);
  }

  const id = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = getServerSession(id);
  if (!session) return fail("UNAUTHENTICATED", 401);

  const backendOrigin = process.env.ZEVYL_AUTH_BACKEND_ORIGIN;
  if (!backendOrigin) return fail("UNAVAILABLE", 503);

  try {
    const result = await createBackendAuthHttp({ backendOrigin })
      .me(session.accessToken);

    if (!result.ok) {
      if (result.code === "UNAUTHENTICATED" ||
          result.code === "FORBIDDEN") {
        revokeServerSession(id);
      }
      return fail(result.code, statusFor(result.code));
    }

    return NextResponse.json(
      { ok: true, value: result.value },
      { status: 200, headers },
    );
  } catch {
    return fail("UNAVAILABLE", 503);
  }
}