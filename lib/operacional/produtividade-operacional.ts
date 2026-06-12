type EntradaProdutividade = {
  sla: number
  eficiencia: number
  estabilidade: number
  risco: number
  cobertura: number
}

export type ProdutividadeOperacional = {
  score: number
  status: "ALTA" | "MODERADA" | "BAIXA"
  descricao: string
}

export function calcularProdutividadeOperacional({
  sla,
  eficiencia,
  estabilidade,
  risco,
  cobertura,
}: EntradaProdutividade): ProdutividadeOperacional {
  let score =
    sla * 0.3 +
    eficiencia * 0.3 +
    estabilidade * 0.2 +
    cobertura * 0.1 -
    risco * 0.1

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "ALTA",
      descricao:
        "Produtividade operacional elevada e sustentada.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "MODERADA",
      descricao:
        "Produtividade operacional moderada monitorada.",
    }
  }

  return {
    score,
    status: "BAIXA",
    descricao:
      "Produtividade operacional reduzida identificada.",
  }
}