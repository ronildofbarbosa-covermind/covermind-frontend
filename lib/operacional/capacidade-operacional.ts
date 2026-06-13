type EntradaCapacidade = {
  produtividade: number
  estabilidade: number
  eficiencia: number
  saturacao: number
  risco: number
}

export type CapacidadeOperacional = {
  score: number
  status: "ELEVADA" | "MODERADA" | "LIMITADA"
  descricao: string
}

export function calcularCapacidadeOperacional({
  produtividade,
  estabilidade,
  eficiencia,
  saturacao,
  risco,
}: EntradaCapacidade): CapacidadeOperacional {
  let score =
    produtividade * 0.3 +
    estabilidade * 0.25 +
    eficiencia * 0.25 -
    saturacao * 0.1 -
    risco * 0.1

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "ELEVADA",
      descricao:
        "Capacidade operacional elevada e sustentada.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "MODERADA",
      descricao:
        "Capacidade operacional moderada monitorada.",
    }
  }

  return {
    score,
    status: "LIMITADA",
    descricao:
      "Capacidade operacional limitada identificada.",
    }
  }