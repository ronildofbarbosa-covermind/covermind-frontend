import { NextRequest, NextResponse } from "next/server";
import {
  revokeServerSession, SESSION_COOKIE_NAME,
} from "../../../../lib/access/server-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");

  if (!origin || origin !== url.origin) {
    return NextResponse.json(
      { ok: false, code: "FORBIDDEN" },
      { status: 403, headers },
    );
  }

  if (url.search || request.headers.has("content-encoding")) {
    return NextResponse.json(
      { ok: false, code: "INVALID_INPUT" },
      { status: 400, headers },
    );
  }

  const id = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  revokeServerSession(id);

  const response = NextResponse.json(
    { ok: true },
    { status: 200, headers },
  );

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}