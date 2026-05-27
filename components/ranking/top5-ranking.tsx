import { CandidatoOperacionalCard } from "@/components/operational/candidato-operacional-card"

type StatusConvocacao =
  | "disponivel"
  | "convocado"
  | "aceito"
  | "recusado"
  | "timeout"

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
          key={`${colaborador.colaborador_id}-${index}`}
          vagaId={vagaId}
          posicao={index + 1}
          nome={colaborador.nome || colaborador.colaborador_id}
          cargo={colaborador.cargo || "Cargo não informado"}
          score={
            colaborador.score_final ??
            colaborador.score ??
            colaborador.score_ranking ??
            0
          }
          distancia={
            colaborador.distancia_km !== null &&
            colaborador.distancia_km !== undefined
              ? `${colaborador.distancia_km} km`
              : "-"
          }
          custo={colaborador.tipo_custo || "-"}
          colaboradorId={colaborador.colaborador_id}
          status={colaborador.status ?? "disponivel"}
        />
      ))}
    </div>
  )
}