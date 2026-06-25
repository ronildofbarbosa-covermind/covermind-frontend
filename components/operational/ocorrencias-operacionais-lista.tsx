import { CardOcorrenciaOperacional } from "./card-ocorrencia-operacional"

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

type RiscoContratual =
  | "NENHUM"
  | "BAIXO"
  | "MEDIO"
  | "ALTO"

type CriticidadePosto =
  | "BAIXA"
  | "MEDIA"
  | "ALTA"
  | "CRITICA"

type ClassificacaoContrato =
  | "PADRAO"
  | "PREMIUM"
  | "VIP"

type OcorrenciaOperacional = {
  id: string
  cliente: string
  posto: string
  filial: string
  cargo: string
  tipoServico: string
  status: StatusOcorrencia
  sla: string
  horarioPosto?: string
  enderecoPosto?: string
  bairroPosto?: string
  cidadePosto?: string
  estadoPosto?: string
  motivoOcorrencia?: string
  grupoOcorrencia?: string
  possuiOcupanteVinculado?: boolean
  matriculaColaborador?: string
  nomeColaborador?: string
  cargoColaborador?: string
  criticidadePosto?: CriticidadePosto
  impactoCliente?: string
  impactoSla?: string
  riscoContratual?: RiscoContratual | string
  nivelImpacto?: NivelImpacto
  iccContrato?: number
  classificacaoContrato?: ClassificacaoContrato
  elegiveis?: number
  filaAtiva?: number
  recusas?: number
  topScore?: number
}

type Props = {
  ocorrencias: OcorrenciaOperacional[]
  ocorrenciaSelecionadaId: string
  onSelecionarOcorrencia: (id: string) => void
}

function obterPesoStatus(status: StatusOcorrencia) {
  switch (status) {
    case "CRITICO":
      return 100
    case "ALERTA":
      return 80
    case "EM_CONVOCACAO":
      return 60
    case "NORMAL":
    default:
      return 20
  }
}

function obterPesoImpacto(nivelImpacto?: NivelImpacto) {
  switch (nivelImpacto) {
    case "CRITICO":
      return 100
    case "ALTO":
      return 70
    case "MEDIO":
      return 40
    case "BAIXO":
    default:
      return 10
  }
}

function obterPesoRiscoContratual(riscoContratual?: RiscoContratual | string) {
  switch (riscoContratual) {
    case "ALTO":
      return 80
    case "MEDIO":
      return 40
    case "BAIXO":
      return 10
    case "NENHUM":
    default:
      return 0
  }
}

function obterPesoCriticidadePosto(criticidadePosto?: CriticidadePosto) {
  switch (criticidadePosto) {
    case "CRITICA":
      return 100
    case "ALTA":
      return 50
    case "MEDIA":
      return 20
    case "BAIXA":
    default:
      return 0
  }
}

function obterPesoElegiveis(elegiveis?: number) {
  const total = elegiveis ?? 0

  if (total === 0) return 100
  if (total <= 3) return 60
  if (total <= 6) return 30

  return 0
}

function obterPesoFila(filaAtiva?: number) {
  const total = filaAtiva ?? 0

  if (total === 0) return 50
  if (total <= 2) return 20

  return 0
}

function obterPesoRecusas(recusas?: number) {
  return Math.min((recusas ?? 0) * 5, 20)
}

function obterPesoICC(
  classificacaoContrato?: "PADRAO" | "PREMIUM" | "VIP"
) {
  switch (classificacaoContrato) {
    case "VIP":
      return 50

    case "PREMIUM":
      return 25

    case "PADRAO":
    default:
      return 0
  }
}

function calcularScoreExecutivo(ocorrencia: OcorrenciaOperacional) {
  return (
    obterPesoStatus(ocorrencia.status) +
    obterPesoImpacto(ocorrencia.nivelImpacto) +
    obterPesoRiscoContratual(ocorrencia.riscoContratual) +
    obterPesoCriticidadePosto(ocorrencia.criticidadePosto) +
    obterPesoElegiveis(ocorrencia.elegiveis) +
    obterPesoFila(ocorrencia.filaAtiva) +
    obterPesoRecusas(ocorrencia.recusas) +
    obterPesoICC(ocorrencia.classificacaoContrato)
  )
}

function converterSlaParaMinutos(sla: string): number {
  if (!sla) return 9999

  const texto = sla.toLowerCase()
  const horasMatch = texto.match(/(\d+)h/)
  const minutosMatch = texto.match(/(\d+)min/)

  const horas = horasMatch ? Number(horasMatch[1]) : 0
  const minutos = minutosMatch ? Number(minutosMatch[1]) : 0

  return horas * 60 + minutos
}

export function OcorrenciasOperacionaisLista({
  ocorrencias,
  ocorrenciaSelecionadaId,
  onSelecionarOcorrencia,
}: Props) {
  const ocorrenciasOrdenadas = [...ocorrencias].sort((a, b) => {
    const scoreA = calcularScoreExecutivo(a)
    const scoreB = calcularScoreExecutivo(b)

    if (scoreA !== scoreB) return scoreB - scoreA

    const slaA = converterSlaParaMinutos(a.sla)
    const slaB = converterSlaParaMinutos(b.sla)

    return slaA - slaB
  })

  const totalCriticos = ocorrencias.filter(
    (item) => item.status === "CRITICO"
  ).length

  const totalAlerta = ocorrencias.filter(
    (item) => item.status === "ALERTA"
  ).length

  const totalConvocacao = ocorrencias.filter(
    (item) => item.status === "EM_CONVOCACAO"
  ).length

  return (
    <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold">
          Ocorrências Operacionais
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Postos descobertos ou em risco no escopo filtrado.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-2 text-center">
          <p className="text-xs text-red-300">Críticos</p>
          <p className="text-lg font-bold text-red-200">{totalCriticos}</p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2 text-center">
          <p className="text-xs text-amber-300">Alerta</p>
          <p className="text-lg font-bold text-amber-200">{totalAlerta}</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2 text-center">
          <p className="text-xs text-cyan-300">Convocação</p>
          <p className="text-lg font-bold text-cyan-200">{totalConvocacao}</p>
        </div>
      </div>

      <div className="space-y-3">
        {ocorrenciasOrdenadas.map((ocorrencia) => (
          <CardOcorrenciaOperacional
            key={ocorrencia.id}
            id={ocorrencia.id}
            cliente={ocorrencia.cliente}
            posto={ocorrencia.posto}
            filial={ocorrencia.filial}
            cargo={ocorrencia.cargo}
            tipoServico={ocorrencia.tipoServico}
            status={ocorrencia.status}
            sla={ocorrencia.sla}
            horarioPosto={ocorrencia.horarioPosto}
            enderecoPosto={ocorrencia.enderecoPosto}
            bairroPosto={ocorrencia.bairroPosto}
            cidadePosto={ocorrencia.cidadePosto}
            estadoPosto={ocorrencia.estadoPosto}
            motivoOcorrencia={ocorrencia.motivoOcorrencia}
            grupoOcorrencia={ocorrencia.grupoOcorrencia}
            possuiOcupanteVinculado={ocorrencia.possuiOcupanteVinculado}
            matriculaColaborador={ocorrencia.matriculaColaborador}
            nomeColaborador={ocorrencia.nomeColaborador}
            cargoColaborador={ocorrencia.cargoColaborador}
            criticidadePosto={ocorrencia.criticidadePosto}
            impactoCliente={ocorrencia.impactoCliente}
            impactoSla={ocorrencia.impactoSla}
            riscoContratual={ocorrencia.riscoContratual}
            nivelImpacto={ocorrencia.nivelImpacto}
            scoreExecutivo={calcularScoreExecutivo(ocorrencia)}
            iccContrato={ocorrencia.iccContrato}
            classificacaoContrato={ocorrencia.classificacaoContrato}
            elegiveis={ocorrencia.elegiveis}
            filaAtiva={ocorrencia.filaAtiva}
            recusas={ocorrencia.recusas}
            topScore={ocorrencia.topScore}
            selecionada={ocorrencia.id === ocorrenciaSelecionadaId}
            onSelecionar={() => onSelecionarOcorrencia(ocorrencia.id)}
          />
        ))}
      </div>
    </section>
  )
}

export type { OcorrenciaOperacional }