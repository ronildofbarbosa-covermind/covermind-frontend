type EntradaEficiencia = {
  sla: number
  estabilidade: number
  recuperacao: number
  risco: number
  recusas: number
}

export type EficienciaOperacional = {
  score: number
  status: "ALTA" | "MODERADA" | "BAIXA"
  descricao: string
}

export function calcularEficienciaOperacional({
  sla,
  estabilidade,
  recuperacao,
  risco,
  recusas,
}: EntradaEficiencia): EficienciaOperacional {
  let score =
    sla * 0.35 +
    estabilidade * 0.3 +
    recuperacao * 0.2 -
    risco * 0.1 -
    recusas * 4

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "ALTA",
      descricao:
        "Eficiência operacional elevada e sustentada.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "MODERADA",
      descricao:
        "Eficiência operacional moderada monitorada.",
    }
  }

  return {
    score,
    status: "BAIXA",
    descricao:
      "Eficiência operacional reduzida identificada.",
  }
}