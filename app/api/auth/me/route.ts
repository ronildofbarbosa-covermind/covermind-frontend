import { NextRequest, NextResponse } from "next/server";
import { type AccessFailureCode } from "../../../../lib/access/backend-auth-contract";
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

export async function GET(request: NextRequest) {
  if (new URL(request.url).search) return fail("INVALID_INPUT", 400);
  const authorization = request.headers.get("authorization");
  if (!authorization || !/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(authorization)
      || authorization.length > 4103) return fail("UNAUTHENTICATED", 401);
  const backendOrigin = process.env.ZEVYL_AUTH_BACKEND_ORIGIN;
  if (!backendOrigin) return fail("UNAVAILABLE", 503);
  try {
    const result = await createBackendAuthHttp({ backendOrigin }).me(authorization.slice(7));
    if (!result.ok) return fail(result.code, statusFor(result.code));
    return NextResponse.json({ ok: true, value: result.value }, { status: 200, headers });
  } catch { return fail("UNAVAILABLE", 503); }
}
