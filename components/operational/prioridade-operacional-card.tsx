type Props = {
  prioridade: "PROGRAMADA" | "ALTA" | "EMERGENCIAL"
}

export function PrioridadeOperacionalCard({
  prioridade,
}: Props) {
  const estilos = {
    PROGRAMADA: {
      cor: "border-emerald-500/30 bg-emerald-500/10",
      badge: "bg-emerald-500 text-black",
      descricao: "Operação estável e programada",
    },

    ALTA: {
      cor: "border-yellow-500/30 bg-yellow-500/10",
      badge: "bg-yellow-400 text-black",
      descricao: "Acompanhamento operacional necessário",
    },

    EMERGENCIAL: {
      cor: "border-red-500/30 bg-red-500/10",
      badge: "bg-red-500 text-white",
      descricao: "Intervenção imediata necessária",
    },
  }

  const estilo = estilos[prioridade]

  return (
    <div
      className={`rounded-2xl border p-5 ${estilo.cor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">
            Prioridade Operacional
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {prioridade}
          </h3>

          <p className="mt-3 text-sm text-slate-300">
            {estilo.descricao}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${estilo.badge}`}
        >
          {prioridade}
        </div>
      </div>
    </div>
  )
}