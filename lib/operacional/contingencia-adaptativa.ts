type EntradaContingencia = {
  nivelRisco: "NORMAL" | "ALERTA" | "CRITICO"
  filaRestante: number
  recusas: number
  postosDescobertos: number
}

export type PlanoContingenciaAdaptativa = {
  severidade: "BAIXA" | "MODERADA" | "ALTA"
  acoes: string[]
  recomendacao: string
}

export function gerarContingenciaAdaptativa({
  nivelRisco,
  filaRestante,
  recusas,
  postosDescobertos,
}: EntradaContingencia): PlanoContingenciaAdaptativa {
  const acoes: string[] = []

  if (filaRestante <= 2) {
    acoes.push(
      "Expandir raio operacional de convocação"
    )
  }

  if (recusas >= 3) {
    acoes.push(
      "Priorizar colaboradores com histórico positivo"
    )
  }

  if (postosDescobertos >= 1) {
    acoes.push(
      "Acionar reserva técnica operacional"
    )
  }

  if (nivelRisco === "CRITICO") {
    acoes.push(
      "Liberar contingência emergencial controlada"
    )

    return {
      severidade: "ALTA",
      acoes,
      recomendacao:
        "Contingência operacional imediata recomendada.",
    }
  }

  if (nivelRisco === "ALERTA") {
    return {
      severidade: "MODERADA",
      acoes,
      recomendacao:
        "Reforçar estabilidade operacional preventiva.",
    }
  }

  return {
    severidade: "BAIXA",
    acoes: [
      "Operação dentro dos parâmetros esperados",
    ],
    recomendacao:
      "Manter monitoramento operacional contínuo.",
  }
}