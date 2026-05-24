interface CandidatoRanking {
  colaborador_id?: string
  nome?: string
  cargo?: string
  score_final?: number
  score?: number
  distancia_km?: number
  tipo_custo?: string
  motivo?: string
}

interface Top5RankingProps {
  ranking: CandidatoRanking[]
}

export function Top5Ranking({ ranking }: Top5RankingProps) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-[#020817] p-5 text-slate-400">
        Nenhum candidato encontrado para esta vaga.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ranking.slice(0, 5).map((candidato, index) => {
        const score =
          candidato.score_final ??
          candidato.score ??
          0

        return (
          <div
            key={`${candidato.colaborador_id}-${index}`}
            className={`rounded-2xl border p-5 ${
              index === 0
                ? "border-emerald-500 bg-[#020817]"
                : "border-slate-800 bg-[#020817]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  TOP {index + 1} · {candidato.nome ?? "Colaborador"}
                </h3>

                <p className="mt-2 text-slate-400">
                  {candidato.cargo ?? "Cargo não informado"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Score</p>
                <h2 className="text-4xl font-bold text-emerald-400">
                  {score}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Info
                titulo="Distância"
                valor={`${candidato.distancia_km ?? "-"} km`}
              />

              <Info
                titulo="Custo"
                valor={candidato.tipo_custo ?? "não informado"}
              />

              <Info
                titulo="ID"
                valor={candidato.colaborador_id ?? "-"}
              />
            </div>

            <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500">
              Convocar Colaborador
            </button>
          </div>
        )
      })}
    </div>
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
      <p className="font-bold text-white">{valor}</p>
    </div>
  )
}