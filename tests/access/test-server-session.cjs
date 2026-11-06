"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const ts = require("typescript");

const frontend = process.cwd();
const target = path.resolve(frontend, "lib/access/server-session.ts");
const source = fs.readFileSync(target, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022
  },
  fileName: target,
  reportDiagnostics: true
});
const errors = (compiled.diagnostics || [])
  .filter(d => d.category === ts.DiagnosticCategory.Error);
assert.equal(errors.length, 0, "TRANSPILE_ERRORS");

const moduleObj = { exports: {} };
const safeRequire = (id) => {
  if (id === "server-only") return {};
  if (id === "node:crypto") return crypto;
  throw new Error("UNEXPECTED_IMPORT: " + id);
};
const execute = vm.runInThisContext(
  `(function(require,module,exports,Buffer,TextDecoder){
${compiled.outputText}
})`,
  { filename: "server-session.compiled.cjs" }
);
execute(safeRequire, moduleObj, moduleObj.exports, Buffer, TextDecoder);

const {
  createServerSession,
  getServerSession,
  revokeServerSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} = moduleObj.exports;

const now = 1800000000000;
const jwt = (exp) => {
  const enc = x => Buffer.from(JSON.stringify(x)).toString("base64url");
  return `${enc({alg:"HS256",typ:"zevyl-access+jwt"})}.${enc({exp})}.${Buffer.alloc(32,7).toString("base64url")}`;
};

let count = 0;
function test(name, fn) {
  fn();
  count++;
  process.stdout.write(`PASS ${name}\n`);
}

test("exports_and_cookie_metadata", () => {
  assert.equal(SESSION_COOKIE_NAME, "zevyl_dem_session");
  assert.equal(SESSION_MAX_AGE_SECONDS, 3600);
});
test("create_and_retrieve", () => {
  const token = jwt(Math.floor(now / 1000) + 120);
  const s = createServerSession(token, now);
  assert.ok(s);
  assert.match(s.id, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(getServerSession(s.id, now)?.accessToken, token);
  assert.equal(s.expiresAtMs, now + 120000);
});
test("session_isolation", () => {
  const a = createServerSession(jwt(Math.floor(now / 1000) + 121), now);
  const b = createServerSession(jwt(Math.floor(now / 1000) + 122), now);
  assert.ok(a && b);
  assert.notEqual(a.id, b.id);
  assert.notEqual(
    getServerSession(a.id, now)?.accessToken,
    getServerSession(b.id, now)?.accessToken
  );
});
test("jwt_expiry_caps_session", () => {
  const s = createServerSession(jwt(Math.floor(now / 1000) + 86400), now);
  assert.ok(s);
  assert.equal(s.expiresAtMs, now + 3600000);
  assert.equal(getServerSession(s.id, now + 3600000), undefined);
});
test("expired_token_rejected", () => {
  assert.equal(
    createServerSession(jwt(Math.floor(now / 1000) - 1), now),
    undefined
  );
});
test("invalid_token_rejected", () => {
  assert.equal(createServerSession("invalid", now), undefined);
  assert.equal(createServerSession(jwt("not-a-number"), now), undefined);
});
test("invalid_id_rejected", () => {
  assert.equal(getServerSession("bad", now), undefined);
  assert.equal(getServerSession(undefined, now), undefined);
});
test("tampering_rejected", () => {
  const s = createServerSession(jwt(Math.floor(now / 1000) + 120), now);
  assert.ok(s);
  const first = s.id[0] === "A" ? "B" : "A";
  assert.equal(
    getServerSession(first + s.id.slice(1), now),
    undefined
  );
});
test("revocation", () => {
  const s = createServerSession(jwt(Math.floor(now / 1000) + 120), now);
  assert.ok(s);
  revokeServerSession(s.id);
  assert.equal(getServerSession(s.id, now), undefined);
});
test("invalid_clock_rejected", () => {
  assert.equal(
    createServerSession(jwt(Math.floor(now / 1000) + 120), -1),
    undefined
  );
  assert.equal(
    createServerSession(jwt(Math.floor(now / 1000) + 120), NaN),
    undefined
  );
});

process.stdout.write(
  `RESULT=PASS_SESSION_UNIT_TESTS TESTS=${count}\n`
);