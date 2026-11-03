import { NextRequest, NextResponse } from "next/server";
import { LOGIN_BODY_LIMIT, parseLoginRequest, type AccessFailureCode } from "../../../../lib/access/backend-auth-contract";
import { createBackendAuthHttp } from "../../../../lib/access/backend-auth-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "cache-control": "no-store", "x-content-type-options": "nosniff" };
const fail = (code: AccessFailureCode, status: number) => NextResponse.json({ ok: false, code }, { status, headers });
const statusFor = (code: AccessFailureCode): number => ({
  UNAUTHENTICATED: 401, FORBIDDEN: 403, BODY_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415, INVALID_INPUT: 422, UNAVAILABLE: 503,
  INCONCLUSIVE_PROTOCOL: 502,
})[code];

export async function POST(request: NextRequest) {
  // Origin is mandatory: no cross-origin login or browser-simple CSRF bypass.
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return fail("FORBIDDEN", 403);
  if (new URL(request.url).search) return fail("INVALID_INPUT", 400);
  if (request.headers.has("content-encoding")) return fail("INVALID_INPUT", 400);
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader !== null && (!/^\d+$/.test(lengthHeader) || Number(lengthHeader) > LOGIN_BODY_LIMIT)) {
    return fail("BODY_TOO_LARGE", 413);
  }
  const contentType = request.headers.get("content-type");
  // Reject invalid content type before consuming any body.
  if (!contentType || !/^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?\s*$/i.test(contentType)) {
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
    } finally { try { await reader.cancel(); } catch { /* no-op */ } reader.releaseLock(); }
    bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  } catch { return fail("INVALID_INPUT", 422); }
  const parsed = parseLoginRequest(bytes, contentType);
  if (!parsed.ok) return fail(parsed.code, statusFor(parsed.code));
  const backendOrigin = process.env.ZEVYL_AUTH_BACKEND_ORIGIN;
  if (!backendOrigin) return fail("UNAVAILABLE", 503);
  try {
    const result = await createBackendAuthHttp({ backendOrigin }).login(parsed.value);
    if (!result.ok) return fail(result.code, statusFor(result.code));
    return NextResponse.json({ ok: true, value: result.value }, { status: 200, headers });
  } catch { return fail("UNAVAILABLE", 503); }
}
