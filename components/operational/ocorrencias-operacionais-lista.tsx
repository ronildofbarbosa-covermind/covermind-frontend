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

export function OcorrenciasOperacionaisLista({
  ocorrencias,
  ocorrenciaSelecionadaId,
  onSelecionarOcorrencia,
}: Props) {
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

      <div className="space-y-3">
        {ocorrencias.map((ocorrencia) => (
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