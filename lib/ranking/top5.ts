import { ItemFilaOperacional } from "@/types/fila"

export function obterTop5Ranking(
  fila: ItemFilaOperacional[]
): ItemFilaOperacional[] {
  return [...fila]
    .sort((a, b) => {
      const scoreA = a.score ?? a.score_ranking ?? 0
      const scoreB = b.score ?? b.score_ranking ?? 0

      return scoreB - scoreA
    })
    .slice(0, 5)
}