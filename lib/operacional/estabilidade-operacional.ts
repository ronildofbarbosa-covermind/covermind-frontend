type EntradaEstabilidade = {
  sla: number
  risco: number
  saturacao: number
  recuperacao: number
  estabilidadeHistorica: number
}

export type EstabilidadeOperacional = {
  score: number
  status: "ESTAVEL" | "OSCILANDO" | "INSTAVEL"
  descricao: string
}

export function calcularEstabilidadeOperacional({
  sla,
  risco,
  saturacao,
  recuperacao,
  estabilidadeHistorica,
}: EntradaEstabilidade): EstabilidadeOperacional {
  let score =
    sla * 0.3 +
    recuperacao * 0.3 +
    estabilidadeHistorica * 0.2 -
    risco * 0.1 -
    saturacao * 0.1

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "ESTAVEL",
      descricao:
        "Operação com estabilidade estrutural sustentada.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "OSCILANDO",
      descricao:
        "Oscilação operacional moderada monitorada.",
    }
  }

  return {
    score,
    status: "INSTAVEL",
    descricao:
      "Instabilidade operacional relevante identificada.",
  }
}