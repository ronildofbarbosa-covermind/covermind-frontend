"use client"

import { useEffect, useState } from "react"

import { ClienteAnalyticsCard } from "@/components/analytics/cliente-analytics-card"
import { FilialAnalyticsCard } from "@/components/analytics/filial-analytics-card"
import { IndicadorCard } from "@/components/analytics/indicador-card"
import { TendenciaOperacionalCard } from "@/components/analytics/tendencia-operacional-card"
import { KPICard } from "@/components/cards/kpi-card"
import { Sidebar } from "@/components/layout/sidebar"
import { FilaConvocacao } from "@/components/operational/fila-convocacao"
import { HeatmapOperacional } from "@/components/operational/heatmap-operacional"
import { PrioridadeOperacionalCard } from "@/components/operational/prioridade-operacional-card"
import { SlaOperacionalCard } from "@/components/operational/sla-operacional-card"
import { StatusOperacionalCard } from "@/components/operational/status-operacional-card"
import { TimelineOperacional } from "@/components/operational/timeline-operacional"
import { ToastOperacional } from "@/components/operational/toast-operacional"
import { Top5Ranking } from "@/components/ranking/top5-ranking"
import { useFilaOperacional } from "@/hooks/use-fila-operacional"
import { useRealtimeOperacional } from "@/hooks/use-realtime-operacional"
import { obterAnalyticsExecutivos } from "@/lib/analytics/indicadores-executivos"

import {
  buscarPainelExecutivo,
  buscarRankingVaga,
} from "../services/api"

type ResumoExecutivo = {
  total_contextos_vulnerabilidade?: number
  postos_maturidade_critica?: number
  total_contextos_reincidencia?: number
  reserva_operacional_em_atencao?: number
}

type PainelExecutivo = {
  resumo_executivo?: ResumoExecutivo
}

type RankingVaga = {
  cliente?: string | null
  posto?: string | null
  grupo_servico?: string | null
  filial?: string | null
  cargo?: string | null
  total_elegiveis?: number | null
}

export default function CoberturasPage() {
  const vagaOperacionalId = "VAGA-002"

  const [painel, setPainel] = useState<PainelExecutivo | null>(null)
  const [ranking, setRanking] = useState<RankingVaga | null>(null)
  const [carregandoPainel, setCarregandoPainel] = useState(true)
  const [erroPainel, setErroPainel] = useState<string | null>(null)

  const {
    fila: filaConvocacao,
    top5,
    loading: carregandoFila,
    erro: erroFila,
    ultimaAtualizacao,
    mensagemOperacional,
    eventos,
  } = useFilaOperacional(vagaOperacionalId)

  useRealtimeOperacional()

  useEffect(() => {
    async function carregarDadosGerais() {
      try {
        setCarregandoPainel(true)
        setErroPainel(null)

        const [painelResposta, rankingResposta] = await Promise.all([
          buscarPainelExecutivo(),
          buscarRankingVaga(vagaOperacionalId),
        ])

        setPainel(painelResposta)
        setRanking(rankingResposta)
      } catch (error) {
        console.error(error)
        setErroPainel("Erro ao carregar dados gerais do painel")
      } finally {
        setCarregandoPainel(false)
      }
    }

    carregarDadosGerais()
  }, [vagaOperacionalId])

  const resumo = painel?.resumo_executivo

  const vagasAbertas = resumo?.total_contextos_vulnerabilidade ?? 0
  const postosCriticos = resumo?.postos_maturidade_critica ?? 0
  const reincidencias = resumo?.total_contextos_reincidencia ?? 0
  const reservaAtencao = resumo?.reserva_operacional_em_atencao ?? 0

  const statusOperacional =
    reincidencias >= 3
      ? "CRITICO"
      : reincidencias >= 1
        ? "ALERTA"
        : "NORMAL"

  const slaOperacional =
    statusOperacional === "CRITICO"
      ? 48
      : statusOperacional === "ALERTA"
        ? 72
        : 96

  const prioridadeOperacional =
    statusOperacional === "CRITICO"
      ? "EMERGENCIAL"
      : statusOperacional === "ALERTA"
        ? "ALTA"
        : "PROGRAMADA"

  const heatmapOperacional = [
    {
      filial: "FLORIANÓPOLIS",
      status: "CRITICO" as const,
    },
    {
      filial: "CURITIBA",
      status: "ALERTA" as const,
    },
    {
      filial: "JOINVILLE",
      status: "NORMAL" as const,
    },
  ]

  const analyticsExecutivos = obterAnalyticsExecutivos()

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <ToastOperacional mensagem={mensagemOperacional} />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                  Operação em Tempo Real
                </span>

                <h1 className="mt-4 text-5xl font-bold">
                  Painel Operacional de Coberturas
                </h1>

                <p className="mt-3 text-lg text-slate-400">
                  Gestão inteligente de vagas, ranking operacional, SLA e contingência.
                </p>

                {(erroPainel || erroFila) && (
                  <p className="mt-3 text-sm text-red-400">
                    {erroPainel ?? erroFila}
                  </p>
                )}
              </div>

              <div className="w-[260px] rounded-3xl border border-slate-800 bg-[#0f172a] p-5">
                <p className="text-sm text-slate-400">Backend FastAPI</p>

                <h2 className="mt-2 text-2xl font-bold text-emerald-400">
                  {painel ? "ONLINE" : "OFFLINE"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Dados operacionais reais
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  {carregandoFila
                    ? "Sincronizando..."
                    : erroFila
                      ? "Falha na sincronização"
                      : ultimaAtualizacao
                        ? `Atualizado às ${ultimaAtualizacao.toLocaleTimeString("pt-BR")}`
                        : "Aguardando sincronização"}
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-4 gap-6">
              <KPICard
                titulo="Vagas/Riscos Ativos"
                valor={vagasAbertas}
                descricao="contextos operacionais"
              />

              <KPICard
                titulo="Postos Críticos"
                valor={postosCriticos}
                descricao="baixa maturidade"
              />

              <KPICard
                titulo="Reincidências"
                valor={reincidencias}
                descricao="histórico operacional"
              />

              <KPICard
                titulo="Reserva em Atenção"
                valor={reservaAtencao}
                descricao="filiais/grupos em alerta"
              />
            </div>

            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  Analytics Executivo Inteligente
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Indicadores estratégicos da operação em tempo real.
                </p>
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <IndicadorCard
                  titulo="Taxa de Cobertura"
                  valor={analyticsExecutivos.taxaCobertura}
                  descricao="Coberturas concluídas com sucesso"
                />

                <IndicadorCard
                  titulo="Taxa de Aceite"
                  valor={analyticsExecutivos.taxaAceite}
                  descricao="Aceites realizados nas convocações"
                />

                <IndicadorCard
                  titulo="Taxa de Recusa"
                  valor={analyticsExecutivos.taxaRecusa}
                  descricao="Convocações recusadas"
                />
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <IndicadorCard
                  titulo="TMC"
                  valor={analyticsExecutivos.tmc}
                  descricao="Tempo médio entre ocorrência e assunção validada do posto"
                />

                <IndicadorCard
                  titulo="TMA"
                  valor={analyticsExecutivos.tma}
                  descricao="Tempo médio entre primeira convocação e aceite"
                />

                <IndicadorCard
                  titulo="TMD"
                  valor={analyticsExecutivos.tmd}
                  descricao="Tempo médio entre aceite e chegada ao posto"
                />
              </div>

              <div className="mb-8">
                <TendenciaOperacionalCard
                  percentual={analyticsExecutivos.tendenciaOperacional}
                />
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <FilialAnalyticsCard
                  titulo="Filial Mais Crítica"
                  filial={analyticsExecutivos.filialMaisCritica}
                  status="CRITICO"
                  descricao="Maior pressão operacional identificada"
                />

                <FilialAnalyticsCard
                  titulo="Filial Mais Estável"
                  filial={analyticsExecutivos.filialMaisEstavel}
                  status="NORMAL"
                  descricao="Melhor estabilidade operacional"
                />

                <FilialAnalyticsCard
                  titulo="Maior Pressão Regional"
                  filial={analyticsExecutivos.maiorPressaoRegional}
                  status="ALERTA"
                  descricao="Aumento de demanda operacional"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <ClienteAnalyticsCard
                  titulo="Cliente Mais Crítico"
                  cliente={analyticsExecutivos.clienteMaisCritico}
                  status="CRITICO"
                  descricao="Maior risco operacional identificado"
                />

                <ClienteAnalyticsCard
                  titulo="Cliente Mais Estável"
                  cliente={analyticsExecutivos.clienteMaisEstavel}
                  status="NORMAL"
                  descricao="Maior estabilidade contratual"
                />

                <ClienteAnalyticsCard
                  titulo="Maior Consumo de Cobertura"
                  cliente={analyticsExecutivos.maiorConsumoCobertura}
                  status="ALERTA"
                  descricao="Maior demanda operacional registrada"
                />
              </div>
            </section>

            <div className="mb-8 grid gap-6 lg:grid-cols-3">
              <StatusOperacionalCard
                status={statusOperacional}
                mensagem={
                  statusOperacional === "CRITICO"
                    ? "Timeouts e reincidências operacionais detectados"
                    : statusOperacional === "ALERTA"
                      ? "Oscilações operacionais monitoradas"
                      : "Operação saudável e estabilizada"
                }
              />

              <PrioridadeOperacionalCard
                prioridade={prioridadeOperacional}
              />

              <SlaOperacionalCard
                percentual={slaOperacional}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Vaga Operacional Selecionada
                </h2>

                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {ranking
                          ? `${ranking.cliente} · ${ranking.posto}`
                          : carregandoPainel
                            ? "Carregando vaga operacional"
                            : "Nenhuma vaga carregada"}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {ranking?.grupo_servico ?? "Grupo não informado"}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs">
                      {vagaOperacionalId}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <Info titulo="Filial" valor={ranking?.filial ?? "-"} />
                    <Info titulo="Cargo" valor={ranking?.cargo ?? "-"} />
                    <Info titulo="Elegíveis" valor={ranking?.total_elegiveis ?? 0} />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      Fila de Convocação Ativa
                    </h3>

                    {carregandoFila && (
                      <span className="text-xs text-slate-500">
                        Atualizando fila...
                      </span>
                    )}
                  </div>

                  <FilaConvocacao fila={filaConvocacao} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Ranking Inteligente · Top 5
                </h2>

                <Top5Ranking
                  ranking={top5}
                  vagaId={vagaOperacionalId}
                />
              </section>
            </div>

            <div className="mt-6">
              <HeatmapOperacional
                unidades={heatmapOperacional}
              />
            </div>

            <div className="mt-6">
              <TimelineOperacional eventos={eventos} />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Info({
  titulo,
  valor,
}: {
  titulo: string
  valor: string | number
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="text-xl font-bold">{valor}</p>
    </div>
  )
}
