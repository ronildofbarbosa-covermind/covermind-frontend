"use client"

type Props = {
  titulo: string
  motivos: string[]
  impactoEsperado: string
}

export function ExplicacaoIACard({
  titulo,
  motivos,
  impactoEsperado,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold">
          IA Explicável Operacional
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Justificativa da recomendação inteligente
        </p>
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="text-xs font-bold tracking-wide text-cyan-400">
          DECISÃO EXPLICADA
        </p>

        <p className="mt-2 text-sm font-bold text-slate-100">
          {titulo}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {motivos.map((motivo) => (
          <div
            key={motivo}
            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#020817] p-4"
          >
            <span className="mt-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-300">
              ✓
            </span>

            <p className="text-sm text-slate-200">
              {motivo}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <p className="text-xs font-bold tracking-wide text-emerald-400">
          IMPACTO ESPERADO
        </p>

        <p className="mt-2 text-sm text-slate-200">
          {impactoEsperado}
        </p>
      </div>
    </div>
  )
}