type Props = {
  percentual: number
}

export function TendenciaOperacionalCard({
  percentual,
}: Props) {
  const positiva = percentual >= 0

  return (
    <div
      className={`rounded-2xl border p-5 ${
        positiva
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-red-500/30 bg-red-500/10"
      }`}
    >
      <p className="text-sm text-slate-300">
        Tendência Operacional
      </p>

      <h3 className="mt-3 text-4xl font-bold text-white">
        {positiva ? "+" : ""}
        {percentual}%
      </h3>

      <p className="mt-3 text-sm text-slate-300">
        {positiva
          ? "Melhora operacional nos últimos 7 dias"
          : "Aumento da pressão operacional"}
      </p>
    </div>
  )
}