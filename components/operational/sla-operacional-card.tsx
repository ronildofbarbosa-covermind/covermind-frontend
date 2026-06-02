type Props = {
  percentual: number
}

export function SlaOperacionalCard({
  percentual,
}: Props) {
  const status =
    percentual >= 80
      ? {
          titulo: "SLA Saudável",
          cor: "border-emerald-500/30 bg-emerald-500/10",
          badge: "bg-emerald-500 text-black",
          descricao: "Baixo risco operacional",
        }
      : percentual >= 60
        ? {
            titulo: "SLA em Atenção",
            cor: "border-yellow-500/30 bg-yellow-500/10",
            badge: "bg-yellow-400 text-black",
            descricao: "Oscilação operacional detectada",
          }
        : {
            titulo: "SLA Crítico",
            cor: "border-red-500/30 bg-red-500/10",
            badge: "bg-red-500 text-white",
            descricao: "Elevado risco de degradação",
          }

  return (
    <div
      className={`rounded-2xl border p-5 ${status.cor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">
            SLA Operacional
          </p>

          <h3 className="mt-2 text-4xl font-bold">
            {percentual}%
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            {status.descricao}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${status.badge}`}
        >
          {status.titulo}
        </div>
      </div>
    </div>
  )
}