type ContextoOperacional = {
  cliente: string
  filial: string
  tipoPosto: string
  reincidencias: number
  recusas: number
  emergencias: number
}

export type LeituraMemoriaOperacional = {
  nivel: "ESTAVEL" | "ATENCAO" | "CRITICO"
  memoria: string[]
  recomendacao: string
}

export function analisarMemoriaOperacional({
  cliente,
  filial,
  tipoPosto,
  reincidencias,
  recusas,
  emergencias,
}: ContextoOperacional): LeituraMemoriaOperacional {
  const memoria: string[] = []

  if (reincidencias >= 3) {
    memoria.push(
      `Reincidência operacional elevada no cliente ${cliente}`
    )
  }

  if (recusas >= 2) {
    memoria.push(
      `Aumento de recusas identificado na filial ${filial}`
    )
  }

  if (emergencias >= 2) {
    memoria.push(
      `Posto ${tipoPosto} com alta pressão emergencial`
    )
  }

  if (memoria.length === 0) {
    memoria.push(
      "Operação com estabilidade histórica monitorada"
    )

    return {
      nivel: "ESTAVEL",
      memoria,
      recomendacao:
        "Manter monitoramento preventivo padrão.",
    }
  }

  if (reincidencias >= 5 || recusas >= 4) {
    return {
      nivel: "CRITICO",
      memoria,
      recomendacao:
        "Acionar plano preventivo operacional imediatamente.",
    }
  }

  return {
    nivel: "ATENCAO",
    memoria,
    recomendacao:
      "Reforçar monitoramento operacional contextual.",
  }
}