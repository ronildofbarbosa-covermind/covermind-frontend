/** Offline synthetic contract tests. No backend, secrets, DB or authorization proof. */
import {
  classifyFailure, parseLoginRequest, parseLoginResponse, parseContextResponse,
  LOGIN_BODY_LIMIT, UPSTREAM_BODY_LIMIT,
  type ContractResult, type AccessFailureCode,
} from "../../lib/access/backend-auth-contract";

const bytes = (s: string) => new TextEncoder().encode(s);
const json = (v: unknown) => bytes(JSON.stringify(v));
const login = (email = "demo@example.invalid", senha = " synthetic ") => ({ email, senha });
const context = () => ({ usuario: "demo@example.invalid", usuario_id: 2,
  tenant_id: "synthetic-tenant-a", perfil: "configured-profile-v2", status: "autenticado" });
const token = () => ({ access_token: "synthetic.header.signature", token_type: "bearer" });
const input = (value: unknown) => parseLoginRequest(json(value), "application/json");
const response = (value: unknown) => parseLoginResponse(200, json(value));
const ctx = (value: unknown) => parseContextResponse(200, json(value));
function check(condition: boolean): void { if (!condition) throw new Error("ASSERTION_FAILED"); }
function denied(result: ContractResult<unknown>, code: AccessFailureCode): void {
  check(!result.ok && result.code === code && Object.keys(result).sort().join() === "code,ok");
}
let passed = 0;
const failures: string[] = [];
function test(name: string, body: () => void): void {
  try { body(); passed++; } catch { failures.push(name); }
}

test("values-preserved-and-frozen", () => {
  const result = input(login("Demo@example.invalid", " \tSYNTHETIC\n "));
  check(result.ok);
  if (result.ok) check(result.value.email === "Demo@example.invalid"
    && result.value.senha === " \tSYNTHETIC\n " && Object.isFrozen(result.value)
    && Object.isFrozen(result));
});
test("exact-login-keys", () => {
  for (const value of [{}, { email: "x" }, { senha: "x" },
    { ...login(), tenant_id: "injected" }, { ...login(), perfil: "injected" },
    { ...login(), unexpected: true },
    [], null, true, "text"]) {
    denied(input(value), "INVALID_INPUT");
  }
  denied(parseLoginRequest(bytes('{"email":"x","senha":"y","__proto__":"x"}'), "application/json"), "INVALID_INPUT");
});
test("string-types-only", () => {
  for (const value of [null, true, false, 2, [], {}, ""]) {
    denied(input({ ...login(), email: value }), "INVALID_INPUT");
    denied(input({ ...login(), senha: value }), "INVALID_INPUT");
  }
});
test("email-byte-boundary", () => {
  check(input(login("a".repeat(320))).ok);
  denied(input(login("a".repeat(321))), "INVALID_INPUT");
  check(input(login("é".repeat(160))).ok);
  denied(input(login("é".repeat(161))), "INVALID_INPUT");
  check(input(login("😀".repeat(80))).ok);
  denied(input(login("😀".repeat(81))), "INVALID_INPUT");
});
test("password-byte-boundary", () => {
  check(input(login("x", "a".repeat(72))).ok);
  denied(input(login("x", "a".repeat(73))), "INVALID_INPUT");
  check(input(login("x", "é".repeat(36))).ok);
  denied(input(login("x", "é".repeat(37))), "INVALID_INPUT");
  check(input(login("x", "😀".repeat(18))).ok);
  denied(input(login("x", "😀".repeat(19))), "INVALID_INPUT");
  check(input(login("x", "   ")).ok);
});
test("email-whitespace-and-controls-no-normalization", () => {
  for (const value of [" x", "x ", "\u0085x", "x\u0085", "\u00a0x",
    "x\u3000", "x\nx", "x\u0000x", "x\u007fx", "x\u009fx"]) {
    denied(input(login(value)), "INVALID_INPUT");
  }
  // FEFF is not whitespace under Python str.strip; preserve it as the backend does.
  check(input(login("\ufeffx")).ok);
});
test("password-nul-and-surrogates", () => {
  for (const value of ["x\u0000x", "\ud800", "\udfff", "\ud800x"]) {
    denied(input(login("x", value)), "INVALID_INPUT");
    denied(input(login(value)), "INVALID_INPUT");
  }
  check(input(login("x", "x\u0085x")).ok);
});
test("body-byte-budget", () => {
  const base = JSON.stringify(login());
  check(parseLoginRequest(bytes(base + " ".repeat(LOGIN_BODY_LIMIT - bytes(base).length)), "application/json").ok);
  denied(parseLoginRequest(bytes(base + " ".repeat(LOGIN_BODY_LIMIT - bytes(base).length + 1)), "application/json"), "BODY_TOO_LARGE");
  const escaped = '{"email":"x","senha":"' + "\\u0061".repeat(72) + '"}';
  check(parseLoginRequest(bytes(escaped), "application/json").ok);
});
test("media-type", () => {
  for (const type of [null, "", "text/plain", "application/json; charset=latin1",
    "application/json,application/json", "application/json; x=1", "application/json\n", "x".repeat(129)]) {
    denied(parseLoginRequest(json(login()), type), "UNSUPPORTED_MEDIA_TYPE");
  }
  for (const type of ["application/json", ' Application/JSON ; charset="UTF-8"\t', "application/json;charset=utf-8"]) {
    check(parseLoginRequest(json(login()), type).ok);
  }
});
test("duplicate-decoded-keys", () => {
  for (const body of ['{"email":"x","email":"y","senha":"z"}',
    '{"email":"x","\\u0065mail":"y","senha":"z"}',
    '{"email":"x","senha":"z","senh\\u0061":"y"}']) {
    denied(parseLoginRequest(bytes(body), "application/json"), "INVALID_INPUT");
  }
  denied(parseLoginResponse(200, bytes('{"access_token":"a.b.c","token_type":"bearer","token_\\u0074ype":"bearer"}')), "INCONCLUSIVE_PROTOCOL");
  denied(parseContextResponse(200, bytes(JSON.stringify(context()).replace('"usuario_id":2', '"usuario_id":2,"usuario_\\u0069d":3'))), "INCONCLUSIVE_PROTOCOL");
});
test("strict-json-and-utf8", () => {
  for (const body of ["", "{}{}", "{", '{"email":"x","senha":"y",}',
    '{"email":"x","senha":NaN}', '{"email":"x","senha":Infinity}',
    '{"email":"x","senha":{"nested":true}}', '{"email":"x","senha":["x"]}',
    '\ufeff{"email":"x","senha":"y"}', '{"email":"x","senha":"\\q"}',
    '{"email":"x","senha":"y"} trailing', '{"email":"x"\u00a0,"senha":"y"}']) {
    denied(parseLoginRequest(bytes(body), "application/json"), "INVALID_INPUT");
  }
  for (const invalid of [[0xc0, 0xaf], [0xed, 0xa0, 0x80], [0xff], [0xe2, 0x82]]) {
    denied(parseLoginRequest(new Uint8Array(invalid), "application/json"), "INVALID_INPUT");
    denied(parseContextResponse(200, new Uint8Array(invalid)), "INCONCLUSIVE_PROTOCOL");
    denied(parseLoginResponse(200, new Uint8Array(invalid)), "INCONCLUSIVE_PROTOCOL");
  }
});
test("escaped-json-boundaries-preserved", () => {
  const password = 'a"b\\c,}:[\n';
  const result = input(login("x", password));
  check(result.ok && result.value.senha === password);
});
test("token-structure-is-not-verification", () => {
  check(response(token()).ok); // Deliberately NOT a signed JWT.
  for (const value of ["", "a.b", "a.b.c.d", ".b.c", "a..c", "a.b.",
    "a.b.c=", "a.b.c ", "a.b.é", "a.b.+", "Bearer a.b.c", "a.b.\n", "a.b.c\n", "a.b.c\r\n"]) {
    denied(response({ ...token(), access_token: value }), "INCONCLUSIVE_PROTOCOL");
  }
  check(response({ ...token(), access_token: "a.b." + "x".repeat(4092) }).ok);
  denied(response({ ...token(), access_token: "a.b." + "x".repeat(4093) }), "INCONCLUSIVE_PROTOCOL");
});
test("token-exact-schema", () => {
  for (const value of [{}, { access_token: "a.b.c" }, { token_type: "bearer" },
    { ...token(), token_type: "Bearer" }, { ...token(), token_type: true },
    { ...token(), access_token: 123 }, { ...token(), tenant_id: "injected" }]) {
    denied(response(value), "INCONCLUSIVE_PROTOCOL");
  }
});
test("response-byte-budget", () => {
  for (const [parse, value] of [[parseLoginResponse, token()], [parseContextResponse, context()]] as const) {
    const raw = JSON.stringify(value);
    check(parse(200, bytes(raw + " ".repeat(UPSTREAM_BODY_LIMIT - bytes(raw).length))).ok);
    denied(parse(200, bytes(raw + " ".repeat(UPSTREAM_BODY_LIMIT - bytes(raw).length + 1))), "INCONCLUSIVE_PROTOCOL");
  }
});
test("context-arbitrary-profile-no-role-enum", () => {
  const result = ctx(context());
  check(result.ok && result.value.perfil === "configured-profile-v2"
    && Object.keys(result.value).length === 5 && Object.isFrozen(result.value));
  check(ctx({ ...context(), perfil: "future-configured-profile" }).ok);
});
test("context-exact-keys", () => {
  for (const key of Object.keys(context())) {
    const value: Record<string, unknown> = { ...context() }; delete value[key];
    denied(ctx(value), "INCONCLUSIVE_PROTOCOL");
  }
  denied(ctx({ ...context(), capabilities: ["injected"] }), "INCONCLUSIVE_PROTOCOL");
  denied(ctx({ ...context(), role: "injected" }), "INCONCLUSIVE_PROTOCOL");
});
test("context-text-types", () => {
  for (const key of ["usuario", "tenant_id", "perfil"]) {
    for (const value of [null, true, 1, {}, [], "", " ", " x", "x\u0000", "\ud800"]) {
      denied(ctx({ ...context(), [key]: value }), "INCONCLUSIVE_PROTOCOL");
    }
  }
  for (const value of [null, true, "authenticated", "AUTENTICADO", "autenticado "]) {
    denied(ctx({ ...context(), status: value }), "INCONCLUSIVE_PROTOCOL");
  }
});
test("context-safe-integer-id", () => {
  for (const value of [0, -1, 0.5, true, false, null, "2", Number.MAX_SAFE_INTEGER + 1]) {
    denied(ctx({ ...context(), usuario_id: value }), "INCONCLUSIVE_PROTOCOL");
  }
  check(ctx({ ...context(), usuario_id: Number.MAX_SAFE_INTEGER }).ok);
  for (const raw of ["1.00000000000000000001", "1e0", "1e400", "01", "9007199254740993"]) {
    denied(parseContextResponse(200, bytes(JSON.stringify(context()).replace('"usuario_id":2', '"usuario_id":' + raw))), "INCONCLUSIVE_PROTOCOL");
  }
});
test("failure-statuses-remain-distinct", () => {
  const cases: readonly (readonly [number, AccessFailureCode])[] = [[401, "UNAUTHENTICATED"],
    [403, "FORBIDDEN"], [413, "BODY_TOO_LARGE"], [415, "UNSUPPORTED_MEDIA_TYPE"],
    [422, "INVALID_INPUT"], [503, "UNAVAILABLE"], [302, "INCONCLUSIVE_PROTOCOL"],
    [201, "INCONCLUSIVE_PROTOCOL"], [204, "INCONCLUSIVE_PROTOCOL"], [500, "INCONCLUSIVE_PROTOCOL"]];
  for (const [status, code] of cases) {
    denied(classifyFailure(status), code);
    denied(parseLoginResponse(status, json(token())), code);
    denied(parseContextResponse(status, json(context())), code);
  }
});
test("secrets-never-appear-in-failures", () => {
  const sentinel = "SYNTHETIC_SENSITIVE_DO_NOT_ECHO";
  for (const result of [input({ ...login("x", sentinel), tenant: sentinel }),
    parseLoginResponse(503, bytes(sentinel)), parseContextResponse(403, bytes(sentinel)),
    response({ ...token(), access_token: sentinel }), ctx({ ...context(), detail: sentinel })]) {
    check(!result.ok && !JSON.stringify(result).includes(sentinel));
    check(Object.keys(result).sort().join() === "code,ok");
  }
});
test("calls-do-not-share-tenant-or-mutate-input", () => {
  const first = ctx(context());
  const body = json({ ...context(), tenant_id: "synthetic-tenant-b" });
  const before = body.slice();
  const second = parseContextResponse(200, body);
  check(first.ok && second.ok && first.value.tenant_id === "synthetic-tenant-a"
    && second.value.tenant_id === "synthetic-tenant-b");
  check(body.every((v, i) => v === before[i]));
  denied(ctx({ ...context(), tenant_id: null }), "INCONCLUSIVE_PROTOCOL");
  check(ctx(context()).ok);
});

console.log("C01_TEST_RESULT=" + JSON.stringify({ passed, failures, failed: failures.length,
  scope: "OFFLINE_STRUCTURAL_CONTRACT_ONLY" }));
if (failures.length > 0) throw new Error("C01_OFFLINE_TESTS_FAILED");
