/** DEM-001.C02 — server-side HTTP transport. No persistence or authorization. */
import {
  parseLoginResponse, parseContextResponse, classifyFailure,
  type LoginInput, type TokenEnvelope, type AccessContext,
  type ContractResult, UPSTREAM_BODY_LIMIT,
} from "./backend-auth-contract";

type FetchLike = typeof fetch;
export type AuthHttpOptions = Readonly<{
  backendOrigin: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}>;

const DEFAULT_TIMEOUT_MS = 10_000;

function originUrl(raw: string): URL | undefined {
  try {
    const u = new URL(raw);
    if (!((u.protocol === "https:") ||
      (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")))) return undefined;
    if (u.username || u.password || u.search || u.hash || u.pathname !== "/") return undefined;
    return u;
  } catch { return undefined; }
}

function inconclusive(): ContractResult<never> {
  return Object.freeze({ ok: false, code: "INCONCLUSIVE_PROTOCOL" });
}
function unavailable(): ContractResult<never> {
  return Object.freeze({ ok: false, code: "UNAVAILABLE" });
}

/** Read a bounded response without leaking upstream error bodies. */
async function readBounded(response: Response): Promise<Uint8Array | undefined> {
  if (!response.body) return new Uint8Array(0);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > UPSTREAM_BODY_LIMIT) return undefined;
      chunks.push(next.value);
    }
  } finally {
    try { await reader.cancel(); } catch { /* ignore cancellation failures */ }
    reader.releaseLock();
  }
  const joined = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
  return joined;
}

export function createBackendAuthHttp(options: AuthHttpOptions) {
  const base = originUrl(options.backendOrigin);
  const transport = options.fetchImpl ?? fetch;
  const timeout = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (!base || !Number.isInteger(timeout) || timeout < 1 || timeout > 60_000) {
    throw new Error("INVALID_AUTH_HTTP_CONFIGURATION");
  }

  async function request<T>(
    path: "/login" | "/me", method: "POST" | "GET",
    headers: Record<string, string>, body: string | undefined,
    parse: (status: number, bytes: Uint8Array) => ContractResult<T>,
  ): Promise<ContractResult<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await transport(new URL(path, base), {
        method, headers, body, redirect: "manual", cache: "no-store",
        signal: controller.signal,
      });
      if (response.status !== 200) {
        try { await response.body?.cancel(); } catch { /* ignore */ }
        return classifyFailure(response.status);
      }
      const bytes = await readBounded(response);
      return bytes ? parse(response.status, bytes) : inconclusive();
    } catch {
      return unavailable();
    } finally {
      clearTimeout(timer);
    }
  }

  return Object.freeze({
    login(input: LoginInput): Promise<ContractResult<TokenEnvelope>> {
      // Credentials are never logged or persisted by this adapter.
      return request("/login", "POST", { "content-type": "application/json", accept: "application/json" },
        JSON.stringify({ email: input.email, senha: input.senha }), parseLoginResponse);
    },
    me(accessToken: string): Promise<ContractResult<AccessContext>> {
      if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken)
          || accessToken.length > 4096) return Promise.resolve(inconclusive());
      return request("/me", "GET", { authorization: `Bearer ${accessToken}`, accept: "application/json" },
        undefined, parseContextResponse);
    },
  });
}
