"use client"

import { gerarDecisaoIA } from "@/lib/operacional/motor-decisao-ia"
import { gerarAnalisePreditiva } from "@/lib/operacional/ia-preditiva-operacional"
import { analisarTendenciaOperacional } from "@/lib/operacional/tendencia-operacional"
import { useEffect, useState } from "react"

import { ClienteAnalyticsCard } from "@/components/analytics/cliente-analytics-card"
import { FilialAnalyticsCard } from "@/components/analytics/filial-analytics-card"
import { IndicadorCard } from "@/components/analytics/indicador-card"
import { TendenciaOperacionalCard } from "@/components/analytics/tendencia-operacional-card"
import { KPICard } from "@/components/cards/kpi-card"
import { Sidebar } from "@/components/layout/sidebar"
import { DecisaoIACard } from "@/components/operational/decisao-ia-card"
import { FilaConvocacao } from "@/components/operational/fila-convocacao"
import { HeatmapOperacional } from "@/components/operational/heatmap-operacional"
import { IAPreditivaCard } from "@/components/operational/ia-preditiva-card"
import { PrioridadeOperacionalCard } from "@/components/operational/prioridade-operacional-card"
import { SlaOperacionalCard } from "@/components/operational/sla-operacional-card"
import { StatusOperacionalCard } from "@/components/operational/status-operacional-card"
import { TendenciaIACard } from "@/components/operational/tendencia-ia-card"
import { TimelineOperacional } from "@/components/operational/timeline-operacional"
import { ToastOperacional } from "@/components/operational/toast-operacional"
import { FiltrosOperacionaisGlobais } from "@/components/operational/filtros-operacionais-globais"
import {
  OcorrenciasOperacionaisLista,
  type OcorrenciaOperacional,
} from "@/components/operational/ocorrencias-operacionais-lista"
import { Top5Ranking } from "@/components/ranking/top5-ranking"
import { useFilaOperacional } from "@/hooks/use-fila-operacional"
import { useRealtimeOperacional } from "@/hooks/use-realtime-operacional"
import { obterAnalyticsExecutivos } from "@/lib/analytics/indicadores-executivos"
import { gerarExplicacaoIA } from "@/lib/operacional/explicacao-ia"
import { ExplicacaoIACard } from "@/components/operational/explicacao-ia-card"
import { calcularScoreConfiabilidade } from "@/lib/operacional/score-confiabilidade"
import { ConfiabilidadeIACard } from "@/components/operational/confiabilidade-ia-card"
import { analisarMemoriaOperacional } from "@/lib/operacional/memoria-operacional"
import { MemoriaOperacionalCard } from "@/components/operational/memoria-operacional-card"
import { calcularRiscoOperacionalTempoReal } from "@/lib/operacional/risco-operacional-tempo-real"
import { RiscoTempoRealCard } from "@/components/operational/risco-tempo-real-card"
import { gerarContingenciaAdaptativa } from "@/lib/operacional/contingencia-adaptativa"
import { ContingenciaAdaptativaCard } from "@/components/operational/contingencia-adaptativa-card"
import { calcularIndiceExecutivoOperacional } from "@/lib/operacional/indice-executivo-operacional"
import { IndiceExecutivoCard } from "@/components/operational/indice-executivo-card"
import { gerarRadarRegionalOperacional } from "@/lib/operacional/radar-regional-operacional"
import { RadarRegionalCard } from "@/components/operational/radar-regional-card"
import { calcularSaudeOperacionalCorporativa } from "@/lib/operacional/saude-operacional-corporativa"
import { SaudeCorporativaCard } from "@/components/operational/saude-corporativa-card"
import { gerarUnidadeHeatmapInteligente } from "@/lib/operacional/heatmap-inteligente"
import { HeatmapInteligenteCard } from "@/components/operational/heatmap-inteligente-card"
import { calcularSaturacaoOperacional } from "@/lib/operacional/saturacao-operacional"
import { SaturacaoOperacionalCard } from "@/components/operational/saturacao-operacional-card"
import { calcularPrevisaoColapsoOperacional } from "@/lib/operacional/previsao-colapso-operacional"
import { PrevisaoColapsoCard } from "@/components/operational/previsao-colapso-card"
import { calcularRecuperacaoOperacional } from "@/lib/operacional/recuperacao-operacional"
import { RecuperacaoOperacionalCard } from "@/components/operational/recuperacao-operacional-card"
import { calcularEstabilidadeOperacional } from "@/lib/operacional/estabilidade-operacional"
import { EstabilidadeOperacionalCard } from "@/components/operational/estabilidade-operacional-card"
import { calcularEficienciaOperacional } from "@/lib/operacional/eficiencia-operacional"
import { EficienciaOperacionalCard } from "@/components/operational/eficiencia-operacional-card"
import { calcularProdutividadeOperacional } from "@/lib/operacional/produtividade-operacional"
import { ProdutividadeOperacionalCard } from "@/components/operational/produtividade-operacional-card"
import { calcularCapacidadeOperacional } from "@/lib/operacional/capacidade-operacional"
import { CapacidadeOperacionalCard } from "@/components/operational/capacidade-operacional-card"

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

type RankingItemNormalizado = {
  id: number
  colaborador_id: string
  nome?: string
  cargo?: string
  score?: number
  score_ranking?: number
  distancia_km?: number
  status?: undefined
  status_convocacao?: string
  timeout_segundos?: number
  ordem_convocacao?: number
}

export default function CoberturasPage() {
  const vagaOperacionalId = "VAGA-002"

  const [painel, setPainel] = useState<PainelExecutivo | null>(null)
  const [ranking, setRanking] = useState<RankingVaga | null>(null)
  const [carregandoPainel, setCarregandoPainel] = useState(true)
  const [erroPainel, setErroPainel] = useState<string | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<
    "overview" | "operacao" | "cognitivo" | "observabilidade" | "territorial"
  >("overview")

  const [filialSelecionada, setFilialSelecionada] = useState("TODAS")
  const [tipoServicoSelecionado, setTipoServicoSelecionado] = useState("TODOS")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const [ocorrenciaSelecionadaId, setOcorrenciaSelecionadaId] =
    useState("OC-001")

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

  const decisaoIA = gerarDecisaoIA({
    reincidencias,
    postosCriticos,
    reservaAtencao,
  })

  const recusasOperacionais = filaConvocacao.filter(
    (item) => item.status === "recusado"
  ).length

  const timeoutOperacional = filaConvocacao.filter(
    (item) => item.status === "timeout"
  ).length

  const analisePreditiva = gerarAnalisePreditiva({
    reincidencias,
    recusas: recusasOperacionais,
    timeout: timeoutOperacional,
    postosCriticos,
    reservaAtencao,
  })

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

  const variacaoBaseTendencia = Math.round(
    analyticsExecutivos.tendenciaOperacional / 3
  )

  const scoreAnteriorOperacional = Math.max(
    0,
    analisePreditiva.score + variacaoBaseTendencia
  )

  const tendenciaIA = analisarTendenciaOperacional({
    scoreAtual: analisePreditiva.score,
    scoreAnterior: scoreAnteriorOperacional,
  })

  const melhorColaborador = top5[0]

  const explicacaoIA = gerarExplicacaoIA({
    nome: melhorColaborador?.nome ?? "Colaborador operacional",
    score: melhorColaborador?.score ?? 0,
    distanciaKm: melhorColaborador?.distancia_km ?? 0,
    vezesNoPosto: 12,
    recusasRecentes: 0,
    custoEstimado: 95,
  })

  const confiabilidadeIA = calcularScoreConfiabilidade({
    taxaAceite: analyticsExecutivos?.taxaAceite ?? 85,
    taxaRecusa: analyticsExecutivos?.taxaRecusa ?? 12,
    taxaAtraso: analisePreditiva?.riscoAbandono ?? 8,
    coberturasRealizadas: 12,
    reincidencias: reincidencias ?? 0,
  })

  const memoriaOperacionalIA = analisarMemoriaOperacional({
    cliente: ranking?.cliente ?? "Cliente não informado",
    filial: ranking?.filial ?? "Filial não informada",
    tipoPosto: ranking?.posto ?? "Posto operacional",
    reincidencias,
    recusas: recusasOperacionais,
    emergencias: postosCriticos,
  })

  const riscoTempoReal = calcularRiscoOperacionalTempoReal({
    recusas: recusasOperacionais,
    timeout: timeoutOperacional,
    slaAtual: slaOperacional,
    postosDescobertos: vagasAbertas,
    filaRestante: filaConvocacao.length,
  })

  const contingenciaIA = gerarContingenciaAdaptativa({
    nivelRisco: riscoTempoReal.nivel,
    filaRestante: filaConvocacao.length,
    recusas: recusasOperacionais,
    postosDescobertos: vagasAbertas,
  })

  const indiceExecutivoIA = calcularIndiceExecutivoOperacional({
    sla: slaOperacional,
    recusas: recusasOperacionais,
    reincidencias,
    risco: riscoTempoReal.score,
    estabilidade: confiabilidadeIA.score,
  })

  const radarRegionalIA = gerarRadarRegionalOperacional({
    filial: ranking?.filial ?? "FILIAL OPERACIONAL",
    risco: riscoTempoReal.score,
    reincidencias,
    recusas: recusasOperacionais,
    sla: slaOperacional,
  })

  const saudeCorporativaIA =
    calcularSaudeOperacionalCorporativa({
      sla: slaOperacional,
      risco: riscoTempoReal.score,
      estabilidade: confiabilidadeIA.score,
      recusas: recusasOperacionais,
      reincidencias,
      contingencias: contingenciaIA.acoes.length,
    })

  const heatmapInteligenteIA = [
    gerarUnidadeHeatmapInteligente({
      filial: "FLORIANÓPOLIS",
      risco: riscoTempoReal.score + 20,
      reincidencias: reincidencias + 1,
      recusas: recusasOperacionais,
      sla: Math.max(0, slaOperacional - 20),
    }),
    gerarUnidadeHeatmapInteligente({
      filial: ranking?.filial ?? "CURITIBA",
      risco: riscoTempoReal.score,
      reincidencias,
      recusas: recusasOperacionais,
      sla: slaOperacional,
    }),
    gerarUnidadeHeatmapInteligente({
      filial: "JOINVILLE",
      risco: Math.max(0, riscoTempoReal.score - 35),
      reincidencias: 0,
      recusas: 0,
      sla: 96,
    }),
  ]

  const saturacaoOperacionalIA = calcularSaturacaoOperacional({
    coberturaAtiva: vagasAbertas,
    colaboradoresDisponiveis: filaConvocacao.length,
    recusas: recusasOperacionais,
    reincidencias,
    risco: riscoTempoReal.score,
  })

  const previsaoColapsoIA = calcularPrevisaoColapsoOperacional({
    risco: riscoTempoReal.score,
    saturacao: saturacaoOperacionalIA.score,
    sla: slaOperacional,
    recusas: recusasOperacionais,
    reincidencias,
  })

  const recuperacaoOperacionalIA = calcularRecuperacaoOperacional({
    sla: slaOperacional,
    risco: riscoTempoReal.score,
    saturacao: saturacaoOperacionalIA.score,
    contingencias: contingenciaIA.acoes.length,
    estabilidade: confiabilidadeIA.score,
  })

  const estabilidadeOperacionalIA = calcularEstabilidadeOperacional({
    sla: slaOperacional,
    risco: riscoTempoReal.score,
    saturacao: saturacaoOperacionalIA.score,
    recuperacao: recuperacaoOperacionalIA.score,
    estabilidadeHistorica: confiabilidadeIA.score,
  })

  const eficienciaOperacionalIA = calcularEficienciaOperacional({
    sla: slaOperacional,
    estabilidade: estabilidadeOperacionalIA.score,
    recuperacao: recuperacaoOperacionalIA.score,
    risco: riscoTempoReal.score,
    recusas: recusasOperacionais,
  })

  const produtividadeOperacionalIA = calcularProdutividadeOperacional({
    sla: slaOperacional,
    eficiencia: eficienciaOperacionalIA.score,
    estabilidade: estabilidadeOperacionalIA.score,
    risco: riscoTempoReal.score,
    cobertura: Number(
      String(analyticsExecutivos.taxaCobertura).replace("%", "")
    ),
  })

  const capacidadeOperacionalIA = calcularCapacidadeOperacional({
    produtividade: produtividadeOperacionalIA.score,
    estabilidade: estabilidadeOperacionalIA.score,
    eficiencia: eficienciaOperacionalIA.score,
    saturacao: saturacaoOperacionalIA.score,
    risco: riscoTempoReal.score,
  })

  const top5Normalizado: RankingItemNormalizado[] = top5.map((item) => ({
    id: item.id,
    colaborador_id: item.colaborador_id,
    nome: item.nome ?? undefined,
    cargo: item.cargo ?? undefined,
    score: item.score ?? undefined,
    score_ranking: item.score_ranking ?? undefined,
    distancia_km: item.distancia_km ?? undefined,
    status: undefined,
    status_convocacao: item.status_convocacao ?? undefined,
    timeout_segundos: item.timeout_segundos ?? undefined,
    ordem_convocacao: item.ordem_convocacao ?? undefined,
  }))

  const aplicarFiltros = () => {
    console.log("Aplicando filtros operacionais globais", {
      filialSelecionada,
      tipoServicoSelecionado,
      dataInicio,
      dataFim,
    })
  }

  const limparFiltros = () => {
    setFilialSelecionada("TODAS")
    setTipoServicoSelecionado("TODOS")
    setDataInicio("")
    setDataFim("")
  }

  const ocorrenciasOperacionais: OcorrenciaOperacional[] = [
    {
      id: "OC-001",
      cliente: "Cliente Beta",
      posto: "Recepção",
      filial: "CURITIBA",
      cargo: "Recepcionista",
      tipoServico: "FACILITIES_ACESSOS",
      status: "CRITICO",
      sla: "1h15min",
    },
    {
      id: "OC-002",
      cliente: "Cliente Alfa",
      posto: "Vigilância",
      filial: "FLORIANÓPOLIS",
      cargo: "Vigilante",
      tipoServico: "SEGURANÇA_PATRIMONIAL",
      status: "EM_CONVOCACAO",
      sla: "42min",
    },
    {
      id: "OC-003",
      cliente: "Cliente Gama",
      posto: "Portaria",
      filial: "JOINVILLE",
      cargo: "Porteiro",
      tipoServico: "FACILITIES_ACESSOS",
      status: "ALERTA",
      sla: "2h05min",
    },
    {
      id: "OC-004",
      cliente: "Cliente Ômega",
      posto: "Limpeza Técnica",
      filial: "CURITIBA",
      cargo: "Auxiliar de Limpeza",
      tipoServico: "FACILITIES_SERVICOS",
      status: "NORMAL",
      sla: "3h20min",
    },
  ]

  const ocorrenciaSelecionada =
    ocorrenciasOperacionais.find(
      (ocorrencia) => ocorrencia.id === ocorrenciaSelecionadaId
    ) ?? ocorrenciasOperacionais[0]

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <ToastOperacional mensagem={mensagemOperacional} />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-start justify-between gap-8">
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

              <div className="min-w-[520px] rounded-3xl border border-slate-800 bg-[#0f172a] px-6 py-4">
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <p className="text-sm text-slate-400">Backend FastAPI</p>

                    <h2 className="mt-1 text-2xl font-bold text-emerald-400">
                      {painel ? "ONLINE" : "OFFLINE"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Dados operacionais reais
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {carregandoFila
                        ? "Sincronizando..."
                        : erroFila
                          ? "Falha na sincronização"
                          : ultimaAtualizacao
                            ? `Atualizado às ${ultimaAtualizacao.toLocaleTimeString("pt-BR")}`
                            : "Aguardando sincronização"}
                    </p>

                    <div className="mt-2 inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>


            <FiltrosOperacionaisGlobais
              filialSelecionada={filialSelecionada}
              tipoServicoSelecionado={tipoServicoSelecionado}
              dataInicio={dataInicio}
              dataFim={dataFim}
              onFilialChange={setFilialSelecionada}
              onTipoServicoChange={setTipoServicoSelecionado}
              onDataInicioChange={setDataInicio}
              onDataFimChange={setDataFim}
              onAplicar={aplicarFiltros}
              onLimpar={limparFiltros}
            />

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                  Status Global
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-200">
                  ALERTA
                </p>

                <p className="mt-1 text-xs text-amber-100/70">
                  Operação monitorada em tempo real
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  Pressão Operacional
                </p>

                <p className="mt-2 text-2xl font-bold text-cyan-200">
                  MODERADA
                </p>

                <p className="mt-1 text-xs text-cyan-100/70">
                  Oscilações operacionais controladas
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
                  Risco SLA
                </p>

                <p className="mt-2 text-2xl font-bold text-rose-200">
                  36%
                </p>

                <p className="mt-1 text-xs text-rose-100/70">
                  Risco operacional monitorado
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Filiais Monitoradas
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-200">
                  12
                </p>

                <p className="mt-1 text-xs text-emerald-100/70">
                  Inteligência territorial ativa
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                  IA Engines Ativas
                </p>

                <p className="mt-2 text-2xl font-bold text-violet-200">
                  18
                </p>

                <p className="mt-1 text-xs text-violet-100/70">
                  Motores cognitivos em execução
                </p>
              </div>

              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Coberturas Ativas
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-200">
                  7
                </p>

                <p className="mt-1 text-xs text-orange-100/70">
                  Execuções simultâneas monitoradas
                </p>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-2">
              {[
                { id: "overview", label: "Executive Overview" },
                { id: "operacao", label: "Operação Ativa" },
                { id: "cognitivo", label: "Cockpit Cognitivo IA" },
                { id: "observabilidade", label: "Observabilidade" },
                { id: "territorial", label: "Territorial IA" },
              ].map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() =>
                    setAbaAtiva(
                      aba.id as
                        | "overview"
                        | "operacao"
                        | "cognitivo"
                        | "observabilidade"
                        | "territorial"
                    )
                  }
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    abaAtiva === aba.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {aba.label}
                </button>
              ))}
            </div>

            {abaAtiva === "overview" && (
              <>
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

              
              <div className="mb-8 grid gap-6 lg:grid-cols-4">
                <TendenciaOperacionalCard
                  percentual={analyticsExecutivos.tendenciaOperacional}
                />
              
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

              </>
            )}

            {abaAtiva === "operacao" && (
              <>
            <section className="mt-10 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Operação Ativa em Tempo Real
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Gestão operacional ativa da vaga, fila inteligente e ranking cognitivo.
                </p>
              </div>

              <div className="grid gap-8 xl:grid-cols-[360px_1fr_1fr]">
                <OcorrenciasOperacionaisLista
                  ocorrencias={ocorrenciasOperacionais}
                  ocorrenciaSelecionadaId={ocorrenciaSelecionadaId}
                  onSelecionarOcorrencia={setOcorrenciaSelecionadaId}
                />

              <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Vaga Operacional Selecionada
                </h2>

                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {ocorrenciaSelecionada
                          ? `${ocorrenciaSelecionada.cliente} · ${ocorrenciaSelecionada.posto}`
                          : carregandoPainel
                            ? "Carregando ocorrência operacional"
                            : "Nenhuma ocorrência carregada"}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {ocorrenciaSelecionada?.tipoServico ?? ranking?.grupo_servico ?? "Grupo não informado"}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs">
                      {ocorrenciaSelecionada?.id ?? vagaOperacionalId}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <Info titulo="Filial" valor={ocorrenciaSelecionada?.filial ?? ranking?.filial ?? "-"} />
                    <Info titulo="Cargo" valor={ocorrenciaSelecionada?.cargo ?? ranking?.cargo ?? "-"} />
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
                  ranking={top5Normalizado}
                  vagaId={vagaOperacionalId}
                />

                </section>
            </div>
          </section>

              </>
            )}

            {abaAtiva === "cognitivo" && (
              <>
            <section className="mt-10 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-6 backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  Cockpit Cognitivo IA
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Leitura executiva consolidada das inteligências operacionais.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <DecisaoIACard
                  titulo={decisaoIA.titulo}
                  descricao={decisaoIA.descricao}
                  nivel={decisaoIA.nivel}
                  recomendacao={decisaoIA.recomendacao}
                  impacto={decisaoIA.impacto}
                />

                <IAPreditivaCard
                  score={analisePreditiva.score}
                  nivel={analisePreditiva.nivel}
                  riscoSLA={analisePreditiva.riscoSLA}
                  riscoAbandono={analisePreditiva.riscoAbandono}
                  riscoReincidencia={analisePreditiva.riscoReincidencia}
                  mensagem={analisePreditiva.mensagem}
                />

                <TendenciaIACard
                  tendencia={tendenciaIA.tendencia}
                  mensagem={tendenciaIA.mensagem}
                  variacao={tendenciaIA.variacao}
                />

                <ExplicacaoIACard
                  titulo={explicacaoIA.titulo}
                  motivos={explicacaoIA.motivos}
                  impactoEsperado={explicacaoIA.impactoEsperado}
                />

                <ConfiabilidadeIACard
                  score={confiabilidadeIA.score}
                  nivel={confiabilidadeIA.nivel}
                  mensagem={confiabilidadeIA.mensagem}
                />

                <MemoriaOperacionalCard
                  nivel={memoriaOperacionalIA.nivel}
                  memoria={memoriaOperacionalIA.memoria}
                  recomendacao={memoriaOperacionalIA.recomendacao}
                />
              </div>
            </section>

              </>
            )}

            {abaAtiva === "observabilidade" && (
              <>
            <section className="mt-10 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-6 backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  Observabilidade Operacional Enterprise
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Risco, contingência, saúde, capacidade e performance operacional.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <RiscoTempoRealCard
                  nivel={riscoTempoReal.nivel}
                  score={riscoTempoReal.score}
                  descricao={riscoTempoReal.descricao}
                  recomendacao={riscoTempoReal.recomendacao}
                />

                <ContingenciaAdaptativaCard
                  severidade={contingenciaIA.severidade}
                  acoes={contingenciaIA.acoes}
                  recomendacao={contingenciaIA.recomendacao}
                />

                <IndiceExecutivoCard
                  score={indiceExecutivoIA.score}
                  nivel={indiceExecutivoIA.nivel}
                  descricao={indiceExecutivoIA.descricao}
                />

                <RadarRegionalCard
                  filial={ranking?.filial ?? "FILIAL OPERACIONAL"}
                  status={radarRegionalIA.status}
                  scorePressao={radarRegionalIA.scorePressao}
                  mensagem={radarRegionalIA.mensagem}
                />

                <SaudeCorporativaCard
                  score={saudeCorporativaIA.score}
                  status={saudeCorporativaIA.status}
                  descricao={saudeCorporativaIA.descricao}
                />

                <SaturacaoOperacionalCard
                  score={saturacaoOperacionalIA.score}
                  status={saturacaoOperacionalIA.status}
                  descricao={saturacaoOperacionalIA.descricao}
                />

                <PrevisaoColapsoCard
                  score={previsaoColapsoIA.score}
                  status={previsaoColapsoIA.status}
                  descricao={previsaoColapsoIA.descricao}
                />

                <RecuperacaoOperacionalCard
                  score={recuperacaoOperacionalIA.score}
                  status={recuperacaoOperacionalIA.status}
                  descricao={recuperacaoOperacionalIA.descricao}
                />

                <EstabilidadeOperacionalCard
                  score={estabilidadeOperacionalIA.score}
                  status={estabilidadeOperacionalIA.status}
                  descricao={estabilidadeOperacionalIA.descricao}
                />

                <EficienciaOperacionalCard
                  score={eficienciaOperacionalIA.score}
                  status={eficienciaOperacionalIA.status}
                  descricao={eficienciaOperacionalIA.descricao}
                />

                <ProdutividadeOperacionalCard
                  score={produtividadeOperacionalIA.score}
                  status={produtividadeOperacionalIA.status}
                  descricao={produtividadeOperacionalIA.descricao}
                />

                <CapacidadeOperacionalCard
                  score={capacidadeOperacionalIA.score}
                  status={capacidadeOperacionalIA.status}
                  descricao={capacidadeOperacionalIA.descricao}
                />
              </div>
            </section>

              </>
            )}

            {abaAtiva === "territorial" && (
              <>
            <section className="mt-10 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-6 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  Inteligência Territorial IA
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Leitura cognitiva de pressão operacional por filial.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <HeatmapInteligenteCard unidades={heatmapInteligenteIA} />

                <div className="space-y-6">
                  <HeatmapOperacional
                    unidades={heatmapOperacional}
                  />

                  <TimelineOperacional eventos={eventos} />
                </div>
              </div>
            </section>
              </>
            )}

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
