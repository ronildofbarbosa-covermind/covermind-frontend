import { CardOcorrenciaOperacional } from "./card-ocorrencia-operacional"

type StatusOcorrencia =
  | "CRITICO"
  | "EM_CONVOCACAO"
  | "ALERTA"
  | "NORMAL"

type OcorrenciaOperacional = {
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
    const pesoA = obterPesoStatus(a.status)
    const pesoB = obterPesoStatus(b.status)

    if (pesoA !== pesoB) return pesoB - pesoA

    const slaA = converterSlaParaMinutos(a.sla)
    const slaB = converterSlaParaMinutos(b.sla)

    if (slaA !== slaB) return slaA - slaB

    const recusasA = a.recusas ?? 0
    const recusasB = b.recusas ?? 0

    return recusasB - recusasA
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
            motivoOcorrencia={ocorrencia.motivoOcorrencia}
            grupoOcorrencia={ocorrencia.grupoOcorrencia}
            possuiOcupanteVinculado={ocorrencia.possuiOcupanteVinculado}
            matriculaColaborador={ocorrencia.matriculaColaborador}
            nomeColaborador={ocorrencia.nomeColaborador}
            cargoColaborador={ocorrencia.cargoColaborador}
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