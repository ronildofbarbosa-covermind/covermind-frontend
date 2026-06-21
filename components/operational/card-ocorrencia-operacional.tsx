type StatusOcorrencia =
  | "CRITICO"
  | "EM_CONVOCACAO"
  | "ALERTA"
  | "NORMAL"

type NivelImpacto =
  | "BAIXO"
  | "MEDIO"
  | "ALTO"
  | "CRITICO"

type CriticidadePosto =
  | "BAIXA"
  | "MEDIA"
  | "ALTA"
  | "CRITICA"

type Props = {
  id: string
  cliente: string
  posto: string
  filial: string
  cargo: string
  tipoServico: string
  status: StatusOcorrencia
  sla: string
  motivoOcorrencia?: string
  grupoOcorrencia?: string
  possuiOcupanteVinculado?: boolean
  matriculaColaborador?: string
  nomeColaborador?: string
  cargoColaborador?: string
  criticidadePosto?: CriticidadePosto
  impactoCliente?: string
  impactoSla?: string
  riscoContratual?: string
  nivelImpacto?: NivelImpacto
  scoreExecutivo?: number
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

const estilosImpacto = {
  BAIXO: "bg-emerald-500/20 text-emerald-300",
  MEDIO: "bg-amber-500/20 text-amber-300",
  ALTO: "bg-orange-500/20 text-orange-300",
  CRITICO: "bg-red-500/20 text-red-300",
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
  motivoOcorrencia = "Motivo não informado",
  grupoOcorrencia = "Grupo não informado",
  possuiOcupanteVinculado = false,
  matriculaColaborador,
  nomeColaborador,
  cargoColaborador,
  criticidadePosto = "MEDIA",
  impactoCliente = "Não informado",
  impactoSla = "Não informado",
  riscoContratual = "Não informado",
  nivelImpacto = "BAIXO",
  scoreExecutivo = 0,
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

      <div className="mb-3 rounded-xl border border-blue-500/30 bg-blue-950/20 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-blue-300">
            Score Executivo
          </span>

          <span className="text-xl font-bold text-blue-200">
            {scoreExecutivo}
          </span>
        </div>
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

      <div className="mt-4 rounded-xl border border-slate-800 bg-[#06101f] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Motivo da cobertura
        </p>

        <p className="mt-1 text-sm font-bold text-white">
          {motivoOcorrencia}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {grupoOcorrencia}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Criticidade do posto:
          <span className="ml-1 font-semibold text-white">
            {criticidadePosto}
          </span>
        </p>
      </div>

      {possuiOcupanteVinculado && (
        <div className="mt-3 rounded-xl border border-slate-800 bg-[#06101f] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Colaborador vinculado
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {matriculaColaborador ?? "-"} · {nomeColaborador ?? "Nome não informado"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {cargoColaborador ?? "Cargo não informado"}
          </p>
        </div>
      )}

      <div className="mt-3 rounded-xl border border-slate-800 bg-[#06101f] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Impacto operacional
        </p>

        <div className="mt-2 space-y-1">
          <p className="text-xs text-slate-400">
            Cliente:
            <span className="ml-1 font-medium text-white">
              {impactoCliente}
            </span>
          </p>

          <p className="text-xs text-slate-400">
            SLA:
            <span className="ml-1 font-medium text-white">
              {impactoSla}
            </span>
          </p>

          <p className="text-xs text-slate-400">
            Contrato:
            <span className="ml-1 font-medium text-white">
              {riscoContratual}
            </span>
          </p>

          <div className="pt-1">
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                estilosImpacto[nivelImpacto]
              }`}
            >
              Impacto {nivelImpacto}
            </span>
          </div>
        </div>
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

export type { StatusOcorrencia, NivelImpacto, CriticidadePosto }
