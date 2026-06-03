type Props = {
  titulo: string
  filial: string
  status: "NORMAL" | "ALERTA" | "CRITICO"
  descricao: string
}

export function FilialAnalyticsCard({
  titulo,
  filial,
  status,
  descricao,
}: Props) {
  const estilos = {
    NORMAL: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    ALERTA: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    CRITICO: "border-red-500/30 bg-red-500/10 text-red-400",
  }

  return (
    <div className={`rounded-2xl border p-5 ${estilos[status]}`}>
      <p className="text-sm text-slate-300">{titulo}</p>

      <h3 className="mt-3 text-2xl font-bold text-white">
        {filial}
      </h3>

      <p className="mt-3 text-sm text-slate-300">
        {descricao}
      </p>

      <div className="mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold">
        {status}
      </div>
    </div>
  )
}