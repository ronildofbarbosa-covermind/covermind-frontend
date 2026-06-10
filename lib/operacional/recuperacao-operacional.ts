type EntradaRecuperacao = {
  sla: number
  risco: number
  saturacao: number
  contingencias: number
  estabilidade: number
}

export type RecuperacaoOperacional = {
  score: number
  status: "RECUPERAVEL" | "ATENCAO" | "COMPROMETIDA"
  descricao: string
}

export function calcularRecuperacaoOperacional({
  sla,
  risco,
  saturacao,
  contingencias,
  estabilidade,
}: EntradaRecuperacao): RecuperacaoOperacional {
  let score =
    sla * 0.35 +
    estabilidade * 0.25 +
    contingencias * 6 -
    risco * 0.2 -
    saturacao * 0.25

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 70) {
    return {
      score,
      status: "RECUPERAVEL",
      descricao:
        "Capacidade elevada de recuperação operacional.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "ATENCAO",
      descricao:
        "Recuperação operacional moderada monitorada.",
    }
  }

    return {
    score,
    status: "COMPROMETIDA",
    descricao:
      "Capacidade de recuperação comprometida.",
  }
}