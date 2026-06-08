"use client"

type Props = {
  tendencia: "RECUPERANDO" | "ESTAVEL" | "PIORANDO" | "CRITICO"
  mensagem: string
  variacao: number
}

export function TendenciaIACard({
  tendencia,
  mensagem,
  variacao,
}: Props) {
  const estilos = {
    RECUPERANDO: {
      cor: "text-emerald-300",
      borda: "border-emerald-500/30",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      simbolo: "↗",
    },
    ESTAVEL: {
      cor: "text-cyan-300",
      borda: "border-cyan-500/30",
      badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
      simbolo: "→",
    },
    PIORANDO: {
      cor: "text-amber-300",
      borda: "border-amber-500/30",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      simbolo: "↘",
    },
    CRITICO: {
      cor: "text-red-300",
      borda: "border-red-500/30",
      badge: "bg-red-500/10 text-red-300 border-red-500/30",
      simbolo: "⚠",
    },
  }

  const estilo = estilos[tendencia]

  return (
    <div className={`rounded-2xl border ${estilo.borda} bg-[#071224] p-6`}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Tendência Operacional IA</h3>
          <p className="mt-1 text-sm text-slate-400">
            Leitura evolutiva da operação
          </p>
        </div>

        <span className={`rounded-full border px-4 py-1 text-xs font-black ${estilo.badge}`}>
          {tendencia}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className={`text-6xl font-black ${estilo.cor}`}>
          {estilo.simbolo}
        </div>

        <div>
          <p className="text-sm text-slate-500">Variação de risco</p>
          <p className="text-3xl font-black text-white">
            {variacao > 0 ? "+" : ""}
            {variacao}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-[#020817] p-4">
        <p className="text-xs font-bold tracking-wide text-slate-400">
          LEITURA DE TENDÊNCIA
        </p>
        <p className="mt-2 text-sm text-slate-200">{mensagem}</p>
      </div>
    </div>
  )
}