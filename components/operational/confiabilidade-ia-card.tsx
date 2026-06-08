"use client"

type Props = {
  score: number
  nivel: "ALTO" | "MODERADO" | "BAIXO"
  mensagem: string
}

export function ConfiabilidadeIACard({
  score,
  nivel,
  mensagem,
}: Props) {
  const estilos = {
    ALTO: {
      badge:
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      barra: "bg-emerald-400",
    },
    MODERADO: {
      badge:
        "bg-amber-500/10 text-amber-300 border-amber-500/30",
      barra: "bg-amber-400",
    },
    BAIXO: {
      badge:
        "bg-red-500/10 text-red-300 border-red-500/30",
      barra: "bg-red-400",
    },
  }

  const estilo = estilos[nivel]

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Confiabilidade Operacional IA
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Reputação operacional inteligente
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-1 text-xs font-black ${estilo.badge}`}
        >
          {nivel}
        </span>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <p className="text-sm text-slate-500">
            Score de confiança
          </p>

          <p className="text-6xl font-black text-white">
            {score}
          </p>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Baixo</span>
            <span>Alto</span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full ${estilo.barra} transition-all duration-500`}
              style={{
                width: `${score}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-[#020817] p-4">
        <p className="text-xs font-bold tracking-wide text-slate-400">
          LEITURA COMPORTAMENTAL
        </p>

        <p className="mt-2 text-sm text-slate-200">
          {mensagem}
        </p>
      </div>
    </div>
  )
}