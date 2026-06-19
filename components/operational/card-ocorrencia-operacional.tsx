type StatusOcorrencia =
  | "CRITICO"
  | "EM_CONVOCACAO"
  | "ALERTA"
  | "NORMAL"

type Props = {
  id: string
  cliente: string
  posto: string
  filial: string
  cargo: string
  tipoServico: string
  status: StatusOcorrencia
  sla: string
  elegiveis?: number
  filaAtiva?: number
  recusas?: number
  topScore?: number
  selecionada: boolean
  onSelecionar: () => void
}

const estilosStatus = {
  CRITICO: "border-red-500/50 bg-red-950/20 text-red-300",
  EM_CONVOCACAO: "border-cyan-500/50 bg-cyan-950/20 text-cyan-300",
  ALERTA: "border-amber-500/50 bg-amber-950/20 text-amber-300",
  NORMAL: "border-emerald-500/50 bg-emerald-950/20 text-emerald-300",
}

const labelsStatus = {
  CRITICO: "Crítico",
  EM_CONVOCACAO: "Em convocação",
  ALERTA: "Alerta",
  NORMAL: "Normal",
}

export function CardOcorrenciaOperacional({
  id,
  cliente,
  posto,
  filial,
  cargo,
  tipoServico,
  status,
  sla,
  elegiveis = 0,
  filaAtiva = 0,
  recusas = 0,
  topScore = 0,
  selecionada,
  onSelecionar,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selecionada
          ? "border-blue-500 bg-blue-950/20 shadow-[0_0_30px_rgba(37,99,235,0.15)]"
          : "border-slate-800 bg-[#020817] hover:border-slate-600"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${
            estilosStatus[status]
          }`}
        >
          {labelsStatus[status]}
        </span>

        <span className="text-xs text-slate-500">
          {id}
        </span>
      </div>

      <div>
        <p className="font-bold text-white">
          {cliente} · {posto}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {filial} · {cargo}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {tipoServico}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Info label="SLA" valor={sla} />
        <Info label="Elegíveis" valor={elegiveis} />
        <Info label="Fila" valor={filaAtiva} />
        <Info label="Recusas" valor={recusas} />
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-[#06101f] px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Top Score IA
          </span>

          <span className="text-lg font-bold text-emerald-400">
            {topScore}
          </span>
        </div>
      </div>
    </button>
  )
}

function Info({
  label,
  valor,
}: {
  label: string
  valor: string | number
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#06101f] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-white">
        {valor}
      </p>
    </div>
  )
}

export type { StatusOcorrencia }