import { CandidatoOperacionalCard } from "@/components/operational/candidato-operacional-card"

type RankingItem = {
  colaborador_id: string
  nome: string
  cargo: string
  score_final: number
  distancia_km: number
  tipo_custo: string
}

type Props = {
  ranking: RankingItem[]
}

export function Top5Ranking({ ranking }: Props) {
  return (
    <div className="space-y-4">
      {ranking.map((colaborador, index) => (
        <CandidatoOperacionalCard
          key={colaborador.colaborador_id}
          posicao={index + 1}
          nome={colaborador.nome}
          cargo={colaborador.cargo}
          score={colaborador.score_final ?? colaborador.score ?? 0}
          distancia={`${colaborador.distancia_km} km`}
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