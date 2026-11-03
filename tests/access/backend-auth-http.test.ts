/** DEM-001.C02 synthetic offline transport tests; no network access. */
import { createBackendAuthHttp } from "../../lib/access/backend-auth-http";

const assert = (ok: unknown) => { if (!ok) throw new Error("C02_ASSERTION_FAILED"); };
const token = "a.b.c";
const context = { usuario: "demo@example.invalid", usuario_id: 2,
  tenant_id: "synthetic-tenant-a", perfil: "demo", status: "autenticado" };
let passed = 0;
const failures: string[] = [];
async function test(name: string, run: () => Promise<void>) {
  try { await run(); passed++; } catch { failures.push(name); }
}
const mock = (fn: (url: URL, init: RequestInit) => Response | Promise<Response>) =>
  fn as unknown as typeof fetch;

async function main() {
  await test("login-post-and-parse", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock((url, init) => {
        assert(url.toString() === "https://backend.example.invalid/login");
        assert(init.method === "POST" && init.redirect === "manual" && init.cache === "no-store");
        assert(JSON.parse(init.body as string).senha === "synthetic");
        return Response.json({ access_token: token, token_type: "bearer" });
      }) });
    const result = await client.login({ email: "demo@example.invalid", senha: "synthetic" });
    assert(result.ok && result.value.access_token === token);
  });
  await test("me-bearer-context", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock((url, init) => {
        assert(url.pathname === "/me" && init.method === "GET");
        assert((init.headers as Record<string,string>).authorization === `Bearer ${token}`);
        return Response.json(context);
      }) });
    const result = await client.me(token);
    assert(result.ok && result.value.tenant_id === "synthetic-tenant-a");
  });
  await test("reject-origin-and-credentials", async () => {
    for (const origin of ["http://backend.example.invalid/", "https://u:p@backend.example.invalid/",
      "https://backend.example.invalid/path", "https://backend.example.invalid/?q=1"]) {
      let rejected = false;
      try { createBackendAuthHttp({ backendOrigin: origin }); } catch { rejected = true; }
      assert(rejected);
    }
  });
  await test("classify-without-reading-error-body", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock(() => new Response("SECRET_UPSTREAM", { status: 401 })) });
    const result = await client.login({ email: "x", senha: "y" });
    assert(!result.ok && result.code === "UNAUTHENTICATED");
    assert(!JSON.stringify(result).includes("SECRET"));
  });
  await test("oversized-success-body", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock(() => new Response("x".repeat(20_000), { status: 200 })) });
    const result = await client.me(token);
    assert(!result.ok && result.code === "INCONCLUSIVE_PROTOCOL");
  });
  await test("network-failure-sanitized", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock(() => { throw new Error("SECRET_NETWORK_DETAIL"); }) });
    const result = await client.me(token);
    assert(!result.ok && result.code === "UNAVAILABLE");
    assert(!JSON.stringify(result).includes("SECRET"));
  });
  await test("invalid-token-no-request", async () => {
    const client = createBackendAuthHttp({ backendOrigin: "https://backend.example.invalid/",
      fetchImpl: mock(() => { throw new Error("MUST_NOT_CALL"); }) });
    const result = await client.me("Bearer x");
    assert(!result.ok && result.code === "INCONCLUSIVE_PROTOCOL");
  });
  console.log("C02_TEST_RESULT=" + JSON.stringify({ passed, failed: failures.length, failures }));
  if (failures.length) throw new Error("C02_OFFLINE_TESTS_FAILED");
}
void main();
