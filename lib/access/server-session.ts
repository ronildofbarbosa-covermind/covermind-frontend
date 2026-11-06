import "server-only";

import { createHash, randomBytes } from "node:crypto";

type SessionRecord = Readonly<{
  accessToken: string;
  expiresAtMs: number;
}>;

const SESSION_ID_BYTES = 32;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const MAX_SESSIONS = 1000;
const MAX_SESSION_SECONDS = 3600;
const MAX_JWT_BYTES = 4096;
const sessions = new Map<string, SessionRecord>();

function sessionKey(id: string): string {
  return createHash("sha256").update(id, "utf8").digest("hex");
}

function decodeExpiryUntrusted(token: string): number | undefined {
  if (typeof token !== "string" || token.length > MAX_JWT_BYTES ||
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return;
  try {
    const payload = token.split(".")[1];
    if (payload.length > 2048) return;
    const bytes = Buffer.from(payload, "base64url");
    const claims: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (claims === null || typeof claims !== "object" || Array.isArray(claims)) return;
    const exp = (claims as Record<string, unknown>).exp;
    if (typeof exp !== "number" || !Number.isSafeInteger(exp) || exp <= 0) return;
    return exp * 1000;
  } catch { return; }
}

function pruneExpired(now: number): void {
  for (const [key, value] of sessions) {
    if (value.expiresAtMs <= now) sessions.delete(key);
  }
}

/** Call only after the FastAPI /me endpoint has successfully validated the token. */
export function createServerSession(accessToken: string, now = Date.now()):
  Readonly<{ id: string; expiresAtMs: number }> | undefined {
  if (!Number.isSafeInteger(now) || now < 0) return;
  const tokenExpiresAtMs = decodeExpiryUntrusted(accessToken);
  if (tokenExpiresAtMs === undefined || !Number.isSafeInteger(tokenExpiresAtMs)) return;
  const expiresAtMs = Math.min(tokenExpiresAtMs, now + MAX_SESSION_SECONDS * 1000);
  if (expiresAtMs <= now) return;
  pruneExpired(now);
  if (sessions.size >= MAX_SESSIONS) return;
  const id = randomBytes(SESSION_ID_BYTES).toString("base64url");
  sessions.set(sessionKey(id), { accessToken, expiresAtMs });
  return Object.freeze({ id, expiresAtMs });
}

/** Internal server use only; never serialize the returned token into an HTTP response. */
export function getServerSession(id: string | undefined, now = Date.now()): SessionRecord | undefined {
  if (typeof id !== "string" || !SESSION_ID_PATTERN.test(id) || !Number.isSafeInteger(now)) return;
  const key = sessionKey(id);
  const record = sessions.get(key);
  if (!record) return;
  if (record.expiresAtMs <= now) {
    sessions.delete(key);
    return;
  }
  return record;
}

export function revokeServerSession(id: string | undefined): void {
  if (typeof id === "string" && SESSION_ID_PATTERN.test(id)) sessions.delete(sessionKey(id));
}

export const SESSION_COOKIE_NAME = "zevyl_dem_session";
export const SESSION_MAX_AGE_SECONDS = MAX_SESSION_SECONDS;
