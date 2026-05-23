import { buscarPainelExecutivo } from "../services/api"

export default async function CoberturasPage() {
  const painel = await buscarPainelExecutivo()

  const resumo = painel?.resumo_executivo

  const vagasAbertas = resumo?.total_contextos_vulnerabilidade ?? 0
  const postosCriticos = resumo?.postos_maturidade_critica ?? 0
  const reincidencias = resumo?.total_contextos_reincidencia ?? 0

  const postoCritico =
    painel?.alertas_operacionais?.postos_criticos?.[0]

  const topChurn =
    painel?.top_riscos?.churn?.[0]

  return (
    <main className="min-h-screen bg-[#020817] p-8 text-white">
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
          <Kpi titulo="Vagas/Riscos Ativos" valor={vagasAbertas} texto="contextos operacionais" />
          <Kpi titulo="Postos Críticos" valor={postosCriticos} texto="baixa maturidade" />
          <Kpi titulo="Reincidências" valor={reincidencias} texto="histórico operacional" />
          <Kpi titulo="Reserva em Atenção" valor={resumo?.reserva_operacional_em_atencao ?? 0} texto="filiais/grupos em alerta" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <section className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
            <h2 className="mb-6 text-2xl font-bold">Postos Descobertos / Críticos</h2>

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
            <h2 className="mb-6 text-2xl font-bold">Ranking Inteligente</h2>

            <div className="rounded-2xl border border-emerald-500 bg-[#020817] p-5">
              <h3 className="text-xl font-bold text-emerald-400">
                Contexto prioritário
              </h3>

              <p className="mt-2 text-slate-400">
                {topChurn
                  ? `${topChurn.cliente} · ${topChurn.posto}`
                  : "Sem contexto crítico carregado"}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <Info titulo="Filial" valor={topChurn?.filial ?? "-"} />
                <Info titulo="Score Churn" valor={topChurn?.score_churn ?? 0} />
                <Info titulo="Nível" valor={topChurn?.nivel_churn ?? "normal"} />
              </div>

              <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500">
                Abrir Ranking da Vaga
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function Kpi({ titulo, valor, texto }: { titulo: string; valor: number; texto: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-6">
      <p className="text-slate-400">{titulo}</p>
      <h2 className="mt-3 text-5xl font-bold">{valor}</h2>
      <p className="mt-4 text-sm text-blue-400">{texto}</p>
    </div>
  )
}

function Info({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="text-xl font-bold">{valor}</p>
    </div>
  )
}