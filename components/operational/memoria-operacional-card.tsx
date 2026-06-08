"use client"

type Props = {
  nivel: "ESTAVEL" | "ATENCAO" | "CRITICO"
  memoria: string[]
  recomendacao: string
}

export function MemoriaOperacionalCard({
  nivel,
  memoria,
  recomendacao,
}: Props) {
  const estilos = {
    ESTAVEL: {
      badge:
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      glow: "border-emerald-500/20",
    },
    ATENCAO: {
      badge:
        "bg-amber-500/10 text-amber-300 border-amber-500/30",
      glow: "border-amber-500/20",
    },
    CRITICO: {
      badge:
        "bg-red-500/10 text-red-300 border-red-500/30",
      glow: "border-red-500/20",
    },
  }

  const estilo = estilos[nivel]

  return (
    <div
      className={`rounded-2xl border bg-[#071224] p-6 ${estilo.glow}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Memória Operacional IA
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Inteligência contextual histórica
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-1 text-xs font-black ${estilo.badge}`}
        >
          {nivel}
        </span>
      </div>

      <div className="space-y-3">
        {memoria.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-800 bg-[#020817] p-4"
          >
            <p className="text-sm text-slate-200">
              {item}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="text-xs font-bold tracking-wide text-cyan-400">
          RECOMENDAÇÃO CONTEXTUAL
        </p>

        <p className="mt-2 text-sm text-slate-200">
          {recomendacao}
        </p>
      </div>
    </div>
  )
}