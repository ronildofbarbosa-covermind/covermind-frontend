type EntradaRiscoOperacional = {
  recusas: number
  timeout: number
  slaAtual: number
  postosDescobertos: number
  filaRestante: number
}

export type LeituraRiscoTempoReal = {
  nivel: "NORMAL" | "ALERTA" | "CRITICO"
  score: number
  descricao: string
  recomendacao: string
}

export function calcularRiscoOperacionalTempoReal({
  recusas,
  timeout,
  slaAtual,
  postosDescobertos,
  filaRestante,
}: EntradaRiscoOperacional): LeituraRiscoTempoReal {
  let score = 0

  score += recusas * 10
  score += timeout * 12
  score += postosDescobertos * 25

  if (slaAtual < 85) {
    score += 20
  }

  if (filaRestante <= 2) {
    score += 15
  }

  score = Math.max(0, Math.min(100, score))

  if (score >= 70) {
    return {
      nivel: "CRITICO",
      score,
      descricao:
        "Risco elevado de degradação operacional identificado.",
      recomendacao:
        "Acionar contingência operacional imediatamente.",
    }
  }

  if (score >= 40) {
    return {
      nivel: "ALERTA",
      score,
      descricao:
        "Oscilação operacional relevante monitorada.",
      recomendacao:
        "Reforçar cobertura preventiva e monitoramento.",
    }
  }

  return {
    nivel: "NORMAL",
    score,
    descricao:
      "Operação dentro dos parâmetros esperados.",
    recomendacao:
      "Manter monitoramento operacional contínuo.",
  }
}