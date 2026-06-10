type EntradaColapso = {
  risco: number
  saturacao: number
  sla: number
  recusas: number
  reincidencias: number
}

export type PrevisaoColapsoOperacional = {
  score: number
  status: "ESTAVEL" | "INSTAVEL" | "COLAPSO_IMINENTE"
  descricao: string
}

export function calcularPrevisaoColapsoOperacional({
  risco,
  saturacao,
  sla,
  recusas,
  reincidencias,
}: EntradaColapso): PrevisaoColapsoOperacional {
  let score =
    risco * 0.35 +
    saturacao * 0.3 +
    (100 - sla) * 0.2 +
    recusas * 6 +
    reincidencias * 5

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "COLAPSO_IMINENTE",
      descricao:
        "Risco elevado de ruptura operacional progressiva.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "INSTAVEL",
      descricao:
        "Oscilação estrutural relevante monitorada.",
    }
  }

  return {
    score,
    status: "ESTAVEL",
    descricao:
      "Estrutura operacional estabilizada.",
  }
}