type EntradaSaturacao = {
  coberturaAtiva: number
  colaboradoresDisponiveis: number
  recusas: number
  reincidencias: number
  risco: number
}

export type SaturacaoOperacional = {
  score: number
  status: "CONTROLADA" | "ELEVADA" | "SATURADA"
  descricao: string
}

export function calcularSaturacaoOperacional({
  coberturaAtiva,
  colaboradoresDisponiveis,
  recusas,
  reincidencias,
  risco,
}: EntradaSaturacao): SaturacaoOperacional {
  const relacaoCobertura =
    coberturaAtiva /
    Math.max(1, colaboradoresDisponiveis)

  let score =
    relacaoCobertura * 45 +
    recusas * 8 +
    reincidencias * 6 +
    risco * 0.35

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 75) {
    return {
      score,
      status: "SATURADA",
      descricao:
        "Saturação operacional crítica identificada.",
    }
  }

  if (score >= 45) {
    return {
      score,
      status: "ELEVADA",
      descricao:
        "Pressão operacional elevada monitorada.",
    }
  }

  return {
    score,
    status: "CONTROLADA",
    descricao:
      "Saturação operacional sob controle.",
    }
}