"use client"

type Props = {
  titulo: string
  descricao: string
  nivel: "NORMAL" | "ALERTA" | "CRITICO"
  recomendacao: string
  impacto: string
}

export function DecisaoIACard({
  titulo,
  descricao,
  nivel,
  recomendacao,
  impacto,
}: Props) {
  const estilos = {
    NORMAL:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

    ALERTA:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",

    CRITICO:
      "border-red-500/30 bg-red-500/10 text-red-400",
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Central de Decisão IA
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Recomendação operacional inteligente
          </p>
        </div>

        <div
          className={`rounded-full border px-4 py-1 text-xs font-bold ${
            estilos[nivel]
          }`}
        >
          {nivel}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500">
            CONTEXTO OPERACIONAL
          </p>

          <h4 className="mt-1 text-lg font-bold">
            {titulo}
          </h4>

          <p className="mt-2 text-sm text-slate-300">
            {descricao}
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-xs font-bold tracking-wide text-cyan-400">
            AÇÃO RECOMENDADA PELA IA
          </p>

          <p className="mt-2 text-sm text-slate-200">
            {recomendacao}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-[#020817] p-4">
          <p className="text-xs font-bold tracking-wide text-slate-400">
            IMPACTO OPERACIONAL PREVISTO
          </p>

          <p className="mt-2 text-sm text-slate-300">
            {impacto}
          </p>
        </div>
      </div>
    </div>
  )
}