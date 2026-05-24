import { Sidebar } from "@/components/layout/sidebar"
import { KPICard } from "@/components/cards/kpi-card"
import { Top5Ranking } from "@/components/ranking/top5-ranking"
import {
  buscarPainelExecutivo,
  buscarRankingVaga,
} from "../services/api"

export default async function CoberturasPage() {
  const painel = await buscarPainelExecutivo()
  const ranking = await buscarRankingVaga("VAGA-004")

  const resumo = painel?.resumo_executivo
  const top5 = ranking?.top_5 ?? []

  const vagasAbertas = resumo?.total_contextos_vulnerabilidade ?? 0
  const postosCriticos = resumo?.postos_maturidade_critica ?? 0
  const reincidencias = resumo?.total_contextos_reincidencia ?? 0
  const reservaAtencao = resumo?.reserva_operacional_em_atencao ?? 0

  const postoCritico = painel?.alertas_operacionais?.postos_criticos?.[0]

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
                  Postos Descobertos / Críticos
                </h2>

                <div className="rounded-2xl border border-slate-800 bg-[#020817] p-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {postoCritico
                          ? `${postoCritico.cliente} · ${postoCritico.posto}`
                          : "Nenhum posto crítico identificado"}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {postoCritico?.grupo_servico ?? "Sem alerta crítico"}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs">
                      {postoCritico?.nivel_maturidade_posto ?? "normal"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <Info titulo="Índice" valor={postoCritico?.indice_cobertura_treinada ?? 0} />
                    <Info titulo="Treinar" valor={postoCritico?.necessidade_treinamento ?? 0} />
                    <Info titulo="Status" valor={postoCritico ? "Crítico" : "Normal"} />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Ranking Inteligente · Top 5
                </h2>

                <Top5Ranking ranking={top5} />
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