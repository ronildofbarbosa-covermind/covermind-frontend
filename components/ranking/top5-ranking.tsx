import { CandidatoOperacionalCard } from "@/components/operational/candidato-operacional-card"

type RankingItem = {
  colaborador_id: string
  nome: string
  cargo: string
  score_final?: number
  score?: number
  distancia_km: number | null
  tipo_custo: string
}

type Props = {
  ranking: RankingItem[]
  vagaId: string
}

export function Top5Ranking({ ranking, vagaId }: Props) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-[#020817] p-5 text-slate-400">
        Nenhum candidato encontrado para esta vaga.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ranking.map((colaborador, index) => (
        <CandidatoOperacionalCard
          key={colaborador.colaborador_id}
          vagaId={vagaId}
          posicao={index + 1}
          nome={colaborador.nome}
          cargo={colaborador.cargo}
          score={colaborador.score_final ?? colaborador.score ?? 0}
          distancia={
            colaborador.distancia_km !== null &&
            colaborador.distancia_km !== undefined
              ? `${colaborador.distancia_km} km`
              : "-"
          }
          custo={colaborador.tipo_custo}
          colaboradorId={colaborador.colaborador_id}
          status={
            index === 0
              ? "convocado"
              : index === 1
              ? "disponivel"
              : index === 2
              ? "aceito"
              : index === 3
              ? "recusado"
              : "timeout"
          }
        />
      ))}
    </div>
  )
}