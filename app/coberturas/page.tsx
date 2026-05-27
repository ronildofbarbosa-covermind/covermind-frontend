import { Sidebar } from "@/components/layout/sidebar"
import { KPICard } from "@/components/cards/kpi-card"
import { Top5Ranking } from "@/components/ranking/top5-ranking"
import { AcoesConvocacao } from "@/components/operational/acoes-convocacao"

import {
  buscarPainelExecutivo,
  buscarRankingVaga,
  buscarFilaVaga,
} from "../services/api"

type ItemFila = {
  id: number
  colaborador_id: string
  nome?: string | null
  cargo?: string | null
  status: string
  status_convocacao?: string | null
  posicao?: number | null
  ordem_fila?: number | null
  ordem_convocacao?: number | null
  score?: number | null
  score_ranking?: number | null
  distancia_km?: number | null
  timeout_segundos?: number | null
}

export default async function CoberturasPage() {
  const vagaOperacionalId = "VAGA-002"

  const painel = await buscarPainelExecutivo()
  const ranking = await buscarRankingVaga(vagaOperacionalId)
  const fila = await buscarFilaVaga(vagaOperacionalId)

  const resumo = painel?.resumo_executivo

  const filaAtiva = fila?.fila ?? []

  const top5 = filaAtiva.filter(
  (item: any) =>
    item.status === "convocado" ||
    item.status === "pendente" ||
    item.status_convocacao === "fila" ||
    item.status_convocacao === "aguardando"
)

  const filaOriginal: ItemFila[] = fila?.fila ?? []

  const filaMap = new Map<string, ItemFila>()

  for (const item of filaOriginal) {
    filaMap.set(item.colaborador_id, item)
  }

  const filaConvocacao = Array.from(filaMap.values()).sort((a, b) => {
    const ordemA = a.posicao ?? a.ordem_fila ?? a.ordem_convocacao ?? 999
    const ordemB = b.posicao ?? b.ordem_fila ?? b.ordem_convocacao ?? 999
    return ordemA - ordemB
  })

  const vagasAbertas = resumo?.total_contextos_vulnerabilidade ?? 0
  const postosCriticos = resumo?.postos_maturidade_critica ?? 0
  const reincidencias = resumo?.total_contextos_reincidencia ?? 0
  const reservaAtencao = resumo?.reserva_operacional_em_atencao ?? 0

  return (
    <main className="min-h-screen bg-[#020817] text-white">
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
              </div>

              <div className="w-[260px] rounded-3xl border border-slate-800 bg-[#0f172a] p-5">
                <p className="text-sm text-slate-400">Backend FastAPI</p>

                <h2 className="mt-2 text-2xl font-bold text-emerald-400">
                  {painel ? "ONLINE" : "OFFLINE"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Dados operacionais reais
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-4 gap-6">
              <KPICard titulo="Vagas/Riscos Ativos" valor={vagasAbertas} descricao="contextos operacionais" />
              <KPICard titulo="Postos Críticos" valor={postosCriticos} descricao="baixa maturidade" />
              <KPICard titulo="Reincidências" valor={reincidencias} descricao="histórico operacional" />
              <KPICard titulo="Reserva em Atenção" valor={reservaAtencao} descricao="filiais/grupos em alerta" />
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
                  <h3 className="mb-4 text-xl font-bold">
                    Fila de Convocação Ativa
                  </h3>

                  <div className="space-y-4">
                    {filaConvocacao.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-slate-500">
                        Nenhum colaborador na fila operacional.
                      </div>
                    )}

                    {filaConvocacao.map((item) => {
                      const nome = item.nome || item.colaborador_id
                      const cargo = item.cargo || "Colaborador operacional"
                      const posicao =
                        item.posicao ??
                        item.ordem_fila ??
                        item.ordem_convocacao ??
                        "-"

                      const score =
                        item.score ??
                        item.score_ranking ??
                        "-"

                      const tempo = item.timeout_segundos ?? 0

                      return (
                        <div
                          key={`${item.id}-${item.colaborador_id}-${item.status}`}
                          className="rounded-2xl border border-slate-800 bg-[#020817] p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-bold">
                                {nome}
                              </h4>

                              <p className="mt-1 text-sm text-slate-400">
                                {cargo} · {item.colaborador_id}
                              </p>
                            </div>

                            <StatusBadge status={item.status} />
                          </div>

                          <div className="mt-5 grid grid-cols-4 gap-4">
                            <Info titulo="Posição" valor={posicao} />
                            <Info titulo="Score" valor={score} />
                            <Info
                              titulo="Distância"
                              valor={
                                item.distancia_km !== null &&
                                item.distancia_km !== undefined
                                  ? `${item.distancia_km} km`
                                  : "-"
                              }
                            />
                            <Info titulo="Tempo" valor={`${tempo}s`} />
                          </div>

                          {(item.status === "convocado" ||
                            item.status === "pendente") && (
                            <AcoesConvocacao convocacaoId={item.id} />
                          )}
                        </div>
                      )
                    })}
                  </div>
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

function StatusBadge({
  status,
}: {
  status: string
}) {
  const estilos: Record<string, string> = {
    convocado: "bg-amber-500/20 text-amber-400",
    aceito: "bg-emerald-500/20 text-emerald-400",
    recusado: "bg-red-500/20 text-red-400",
    timeout: "bg-orange-500/20 text-orange-400",
    cancelado: "bg-slate-500/20 text-slate-300",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        estilos[status] ?? "bg-slate-500/20 text-slate-300"
      }`}
    >
      {status}
    </span>
  )
}