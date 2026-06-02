type Props = {
  status: "NORMAL" | "ALERTA" | "CRITICO"
  mensagem: string
}

export function StatusOperacionalCard({
  status,
  mensagem,
}: Props) {
  const estilos = {
    NORMAL: {
      cor: "border-emerald-500/30 bg-emerald-500/10",
      badge: "bg-emerald-500 text-black",
      titulo: "NORMAL",
    },

    ALERTA: {
      cor: "border-yellow-500/30 bg-yellow-500/10",
      badge: "bg-yellow-400 text-black",
      titulo: "ALERTA",
    },

    CRITICO: {
      cor: "border-red-500/30 bg-red-500/10",
      badge: "bg-red-500 text-white",
      titulo: "CRÍTICO",
    },
  }

  const estilo = estilos[status]

  return (
    <div
      className={`rounded-2xl border p-5 ${estilo.cor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">
            Saúde Operacional
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {estilo.titulo}
          </h3>

          <p className="mt-2 text-sm text-slate-300">
            {mensagem}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${estilo.badge}`}
        >
          {estilo.titulo}
        </div>
      </div>
    </div>
  )
}