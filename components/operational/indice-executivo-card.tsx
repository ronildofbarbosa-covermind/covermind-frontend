"use client"

type Props = {
  score: number
  nivel:
    | "EXCELENTE"
    | "ESTAVEL"
    | "ATENCAO"
    | "CRITICO"
  descricao: string
}

export function IndiceExecutivoCard({
  score,
  nivel,
  descricao,
}: Props) {
  const estilos = {
    EXCELENTE: {
      badge:
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      glow: "border-emerald-500/20",
      barra: "bg-emerald-400",
    },

    ESTAVEL: {
      badge:
        "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      glow: "border-cyan-500/20",
      barra: "bg-cyan-400",
    },

    ATENCAO: {
      badge:
        "bg-amber-500/10 text-amber-300 border-amber-500/30",
      glow: "border-amber-500/20",
      barra: "bg-amber-400",
    },

    CRITICO: {
      badge:
        "bg-red-500/10 text-red-300 border-red-500/30",
      glow: "border-red-500/20",
      barra: "bg-red-400",
    },
  }

  const estilo = estilos[nivel]

  return (
    <div
      className={`rounded-2xl border bg-[#071224] p-6 ${estilo.glow}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">
            Índice Executivo Operacional IA
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Consolidação executiva da operação
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-1 text-xs font-black ${estilo.badge}`}
        >
          {nivel}
        </span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Operação crítica</span>
          <span>Alta estabilidade</span>
        </div>

        <div className="h-5 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full ${estilo.barra}`}
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <p className="mt-4 text-6xl font-black text-white">
          {score}
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#020817] p-5">
        <p className="text-xs font-bold tracking-wide text-slate-400">
          LEITURA EXECUTIVA
        </p>

        <p className="mt-3 text-sm text-slate-200">
          {descricao}
        </p>
      </div>
    </div>
  )
}