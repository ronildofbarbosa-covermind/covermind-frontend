type Unidade = {
  filial: string
  status: "NORMAL" | "ALERTA" | "CRITICO"
}

type Props = {
  unidades: Unidade[]
}

export function HeatmapOperacional({ unidades }: Props) {
  const estilos = {
    NORMAL: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    ALERTA: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    CRITICO: "border-red-500/30 bg-red-500/10 text-red-400",
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Heatmap Operacional
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Pressão operacional por filial
        </p>
      </div>

      <div className="space-y-4">
        {unidades.map((unidade) => (
          <div
            key={unidade.filial}
            className={`flex items-center justify-between rounded-xl border p-4 ${estilos[unidade.status]}`}
          >
            <span className="font-semibold">
              {unidade.filial}
            </span>

            <span className="text-sm font-bold">
              {unidade.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}