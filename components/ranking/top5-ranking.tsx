type StatusConvocacao =
  | "disponivel"
  | "convocado"
  | "aceito"
  | "recusado"
  | "timeout"
  | "cancelado"

type RankingItem = {
  colaborador_id: string
  nome?: string | null
  cargo?: string | null
  score_final?: number
  score?: number
  score_ranking?: number
  distancia_km?: number | null
  tipo_custo?: string | null
  status?: StatusConvocacao
}

type Props = {
  ranking: RankingItem[]
  vagaId: string
}

export function Top5Ranking({ ranking }: Props) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-[#020817] p-5 text-slate-400">
        Nenhum candidato encontrado para esta vaga.
      </div>
    )
  }

  const [primeiro, ...demais] = ranking

  const scorePrimeiro =
    primeiro.score_final ??
    primeiro.score ??
    primeiro.score_ranking ??
    0

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">
              Recomendação principal IA
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              TOP 1 · {primeiro.nome || primeiro.colaborador_id}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {primeiro.cargo || "Cargo não informado"} · {primeiro.colaborador_id}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">
              Score IA
            </p>

            <p className="text-4xl font-bold text-emerald-300">
              {scorePrimeiro}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-300">
          <div className="rounded-xl border border-emerald-500/20 bg-[#020817]/70 p-3">
            Melhor candidato recomendado pela IA para esta cobertura.
          </div>

          <div className="rounded-xl border border-slate-700 bg-[#020817]/70 p-3">
            Critérios considerados: compatibilidade operacional, ranking, histórico, custo e disponibilidade.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#020817] p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          Demais recomendações
        </p>

        <div className="space-y-2">
          {demais.map((colaborador, index) => {
            const score =
              colaborador.score_final ??
              colaborador.score ??
              colaborador.score_ranking ??
              0

            return (
              <div
                key={`${colaborador.colaborador_id}-${index}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#06101f] px-4 py-3"
              >
                <div>
                  <p className="font-bold text-white">
                    TOP {index + 2} · {colaborador.nome || colaborador.colaborador_id}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {colaborador.cargo || "Cargo não informado"} · {colaborador.colaborador_id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    Score
                  </p>

                  <p className="text-xl font-bold text-emerald-400">
                    {score}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}