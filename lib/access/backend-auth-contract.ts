/**
 * DEM-001 C01: pure structural contracts. No I/O or authorization decision.
 * A parsed token/context is UNVERIFIED; only the backend can establish identity,
 * tenant membership, current policy and token validity. Do not log success values.
 */
export type LoginInput = Readonly<{ email: string; senha: string }>;
export type TokenEnvelope = Readonly<{ access_token: string; token_type: "bearer" }>;
export type AccessContext = Readonly<{
  usuario: string;
  usuario_id: number;
  tenant_id: string;
  perfil: string;
  status: "autenticado";
}>;

// Technical transport categories, never business roles or demand states.
export type AccessFailureCode =
  | "UNAUTHENTICATED" | "FORBIDDEN" | "BODY_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE" | "INVALID_INPUT"
  | "UNAVAILABLE" | "INCONCLUSIVE_PROTOCOL";
export type AccessFailure = Readonly<{ ok: false; code: AccessFailureCode }>;
export type ContractResult<T> = Readonly<{ ok: true; value: T }> | AccessFailure;

export const LOGIN_BODY_LIMIT = 4096;
export const UPSTREAM_BODY_LIMIT = 16 * 1024;

function fail(code: AccessFailureCode): AccessFailure {
  // Never carry input, raw body, parsed objects or exception detail on failures.
  return Object.freeze({ ok: false, code });
}
function success<T>(value: T): ContractResult<T> {
  return Object.freeze({ ok: true, value });
}

/** Classify a non-success status without consuming or exposing its response body. */
export function classifyFailure(status: number): AccessFailure {
  switch (status) {
    case 401: return fail("UNAUTHENTICATED");
    case 403: return fail("FORBIDDEN");
    case 413: return fail("BODY_TOO_LARGE");
    case 415: return fail("UNSUPPORTED_MEDIA_TYPE");
    case 422: return fail("INVALID_INPUT");
    case 503: return fail("UNAVAILABLE");
    default: return fail("INCONCLUSIVE_PROTOCOL");
  }
}

function unicodeScalarString(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
    } else if (c >= 0xdc00 && c <= 0xdfff) return false;
  }
  return true;
}

// Python str.strip whitespace in the existing backend. JS trim differs for
// U+0085/U+001C..U+001F and U+FEFF; do not silently normalize either value.
const PYTHON_EDGE_SPACE = /^[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]|[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]$/u;
function nonemptyText(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
    && unicodeScalarString(value) && !PYTHON_EDGE_SPACE.test(value)
    && !/[\u0000-\u001f\u007f-\u009f]/u.test(value);
}
function utf8Size(value: string): number {
  return new TextEncoder().encode(value).length;
}

type FlatObject = Record<string, unknown>;

/**
 * Bounded flat JSON object reader for these two fixed wire schemas only.
 * JSON.parse alone loses repeated keys. Scan member boundaries first, decode
 * each key with JSON.parse and reject duplicates (including escaped aliases).
 * Reject nesting, trailing data, invalid UTF-8, BOM and lone UTF-16 surrogates.
 * No general JSON parser or object-input trust boundary is exported.
 */
function flatJson(body: Uint8Array, limit: number): FlatObject | undefined {
  try {
    if (!(body instanceof Uint8Array) || body.byteLength > limit) return undefined;
    const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(body);
    let at = 0;
    const ws = () => { while (/[ \t\r\n]/.test(text[at] ?? "x")) at++; };
    const string = (): string | undefined => {
      const match = /^"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"/.exec(text.slice(at));
      if (!match) return undefined;
      at += match[0].length;
      const value: unknown = JSON.parse(match[0]);
      return typeof value === "string" && unicodeScalarString(value) ? value : undefined;
    };
    const object: FlatObject = Object.create(null) as FlatObject;
    const keys = new Set<string>();
    ws();
    if (text[at++] !== "{") return undefined;
    ws();
    if (text[at] !== "}") {
      while (true) {
        if (keys.size >= 8) return undefined;
        const key = string();
        if (key === undefined || keys.has(key)) return undefined;
        keys.add(key); ws();
        if (text[at++] !== ":") return undefined;
        ws();
        let value: unknown;
        if (text[at] === '"') {
          value = string();
          if (value === undefined) return undefined;
        } else {
          const match = /^(?:null|true|false|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/.exec(text.slice(at));
          if (!match) return undefined;
          at += match[0].length;
          value = JSON.parse(match[0]) as unknown;
          // Only the context ID is numeric in these schemas. Require an integer
          // wire representation so decimal/exponent rounding cannot hide a fraction.
          if (typeof value === "number" && (!/^-?(?:0|[1-9][0-9]*)$/.test(match[0])
              || !Number.isSafeInteger(value))) return undefined;
        }
        object[key] = value; ws();
        if (text[at] !== ",") break;
        at++; ws();
      }
    }
    if (text[at++] !== "}") return undefined;
    ws();
    return at === text.length ? object : undefined;
  } catch {
    return undefined;
  }
}

function exactKeys(value: FlatObject, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length
    && keys.every(key => Object.hasOwn(value, key));
}

/** Route integration must separately enforce method, Origin and absence of query. */
export function parseLoginRequest(
  body: Uint8Array, contentType: string | null,
): ContractResult<LoginInput> {
  if (typeof contentType !== "string" || contentType.length > 128
      || !/^application\/json(?:[ \t]*;[ \t]*charset[ \t]*=[ \t]*(?:utf-8|"utf-8"))?$(?![\s\S])/.test(
        contentType.replace(/^[ \t]+|[ \t]+$/g, "").toLowerCase())) {
    return fail("UNSUPPORTED_MEDIA_TYPE");
  }
  if (!(body instanceof Uint8Array)) return fail("INVALID_INPUT");
  if (body.byteLength > LOGIN_BODY_LIMIT) return fail("BODY_TOO_LARGE");
  const value = flatJson(body, LOGIN_BODY_LIMIT);
  if (!value || !exactKeys(value, ["email", "senha"]) || !nonemptyText(value.email)
      || utf8Size(value.email) > 320 || typeof value.senha !== "string"
      || value.senha.length === 0 || !unicodeScalarString(value.senha)
      || value.senha.includes("\0") || utf8Size(value.senha) > 72) {
    return fail("INVALID_INPUT");
  }
  return success(Object.freeze({ email: value.email, senha: value.senha }));
}

/** Structural token syntax ONLY: no signature, claims, expiry or authorization proof. */
export function parseLoginResponse(status: number, body: Uint8Array): ContractResult<TokenEnvelope> {
  if (status !== 200) return classifyFailure(status);
  const value = flatJson(body, UPSTREAM_BODY_LIMIT);
  if (!value || !exactKeys(value, ["access_token", "token_type"])
      || value.token_type !== "bearer" || typeof value.access_token !== "string"
      || value.access_token.length > 4096
      || /[^A-Za-z0-9_.-]/.test(value.access_token)
      || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value.access_token)) {
    return fail("INCONCLUSIVE_PROTOCOL");
  }
  return success(Object.freeze({ access_token: value.access_token, token_type: "bearer" }));
}

/** Structural DTO ONLY. Never infer business capabilities from perfil or this result. */
export function parseContextResponse(status: number, body: Uint8Array): ContractResult<AccessContext> {
  if (status !== 200) return classifyFailure(status);
  const value = flatJson(body, UPSTREAM_BODY_LIMIT);
  if (!value || !exactKeys(value, ["usuario", "usuario_id", "tenant_id", "perfil", "status"])
      || !nonemptyText(value.usuario) || !nonemptyText(value.tenant_id)
      || !nonemptyText(value.perfil) || value.status !== "autenticado"
      || typeof value.usuario_id !== "number" || !Number.isSafeInteger(value.usuario_id)
      || value.usuario_id <= 0) return fail("INCONCLUSIVE_PROTOCOL");
  return success(Object.freeze({ usuario: value.usuario, usuario_id: value.usuario_id,
    tenant_id: value.tenant_id, perfil: value.perfil, status: "autenticado" }));
}
