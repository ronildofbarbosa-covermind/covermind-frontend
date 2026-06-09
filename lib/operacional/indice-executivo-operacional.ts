type EntradaIndiceExecutivo = {
  sla: number
  recusas: number
  reincidencias: number
  risco: number
  estabilidade: number
}

export type IndiceExecutivoOperacional = {
  score: number
  nivel: "EXCELENTE" | "ESTAVEL" | "ATENCAO" | "CRITICO"
  descricao: string
}

export function calcularIndiceExecutivoOperacional({
  sla,
  recusas,
  reincidencias,
  risco,
  estabilidade,
}: EntradaIndiceExecutivo): IndiceExecutivoOperacional {
  let score =
    sla * 0.35 +
    estabilidade * 0.30 +
    (100 - risco) * 0.20 +
    (100 - recusas * 10) * 0.10 +
    (100 - reincidencias * 5) * 0.05

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 85) {
    return {
      score,
      nivel: "EXCELENTE",
      descricao:
        "Operação altamente estável e controlada.",
    }
  }

  if (score >= 70) {
    return {
      score,
      nivel: "ESTAVEL",
      descricao:
        "Operação dentro dos parâmetros esperados.",
    }
  }

  if (score >= 50) {
    return {
      score,
      nivel: "ATENCAO",
      descricao:
        "Oscilações operacionais exigem monitoramento.",
    }
  }

  return {
    score,
    nivel: "CRITICO",
    descricao:
      "Risco operacional elevado identificado.",
  }
}