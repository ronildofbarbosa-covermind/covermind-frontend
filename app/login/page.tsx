"use client"

import { useState, type FormEvent } from "react"
import { Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !senha) {
      setMessage("Informe seu e-mail e sua senha.")
      return
    }

    setMessage(
      "Interface de demonstração validada. A autenticação segura será habilitada após a conclusão da sessão no servidor."
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030917] px-5 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 15%, rgba(0,119,255,.18), transparent 44%), radial-gradient(ellipse at 90% 80%, rgba(0,217,255,.10), transparent 42%)",
        }}
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[#081426]/95 shadow-[0_28px_100px_rgba(0,0,0,.55)] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative flex flex-col justify-between border-b border-white/10 p-9 sm:p-12 lg:min-h-[640px] lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center">
              <img
                src="/branding/zevyl-logo-oficial.png"
                alt="ZEVYL — logomarca oficial"
                width={330}
                height={226}
                className="h-auto w-44 object-contain sm:w-52"
              />
            </div>

            <div className="mt-10 max-w-md">

              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Inteligências especializadas. Decisões conectadas. Evolução contínua.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                A ZEVYL é um ecossistema tecnológico de inteligência artificial
                que integra IAs especializadas, motores operacionais, decisórios
                e cognitivos para transformar dados em inteligência, apoiar
                decisões e potencializar a eficiência das operações.
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                Uma plataforma em constante expansão e aprimoramento,
                desenvolvida para evoluir com novos conhecimentos,
                capacidades e desafios empresariais.
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="size-4 text-cyan-300" aria-hidden="true" />
            Ambiente de demonstração controlado
          </div>
        </section>

        <section className="flex items-center p-9 sm:p-12">
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-300">
              Acesso à plataforma
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Bem-vindo à ZEVYL
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Informe suas credenciais para continuar.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="zevyl-email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  E-mail corporativo
                </label>
                <input
                  id="zevyl-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setMessage("")
                  }}
                  placeholder="usuario@empresa.com.br"
                  className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </div>

              <div>
                <label
                  htmlFor="zevyl-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Senha
                </label>
                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-4 top-4 size-4 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="zevyl-password"
                    type={showPassword ? "text" : "password"}
                    name="senha"
                    autoComplete="current-password"
                    required
                    value={senha}
                    onChange={(event) => {
                      setSenha(event.target.value)
                      setMessage("")
                    }}
                    placeholder="Sua senha"
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 font-semibold text-[#031222] transition hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Entrar na plataforma
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100"
                >
                  {message}
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-slate-500">
              Prévia visual. Nenhuma credencial é enviada ao servidor
              nesta etapa.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
