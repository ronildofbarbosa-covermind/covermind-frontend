type Props = {
  status: "disponivel" | "convocado" | "aceito" | "recusado" | "timeout"
}

const styles = {
  disponivel: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  convocado: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  aceito: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  recusado: "bg-red-500/20 text-red-300 border-red-500/30",
  timeout: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
}

const labels = {
  disponivel: "Disponível",
  convocado: "Convocado",
  aceito: "Aceito",
  recusado: "Recusado",
  timeout: "Timeout",
}

export function ConvocacaoStatus({ status }: Props) {
  return (
    <div
      className={`
        inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </div>
  )
}