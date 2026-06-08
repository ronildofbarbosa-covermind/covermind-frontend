type EntradaExplicacaoIA = {
  nome: string
  score: number
  distanciaKm?: number | null
  vezesNoPosto?: number
  recusasRecentes?: number
  custoEstimado?: number
}

export type ExplicacaoIA = {
  titulo: string
  motivos: string[]
  impactoEsperado: string
}

export function gerarExplicacaoIA({
  nome,
  score,
  distanciaKm,
  vezesNoPosto = 0,
  recusasRecentes = 0,
  custoEstimado = 0,
}: EntradaExplicacaoIA): ExplicacaoIA {
  const motivos: string[] = []

  if (score >= 150) {
    motivos.push(
      "Score operacional elevado para o contexto atual"
    )
  }

  if (
    distanciaKm !== null &&
    distanciaKm !== undefined &&
    distanciaKm <= 15
  ) {
    motivos.push(
      "Baixa distância operacional estimada"
    )
  }

  if (vezesNoPosto >= 3) {
    motivos.push(
      `Experiência anterior no posto (${vezesNoPosto} coberturas)`
    )
  }

  if (recusasRecentes === 0) {
    motivos.push(
      "Histórico recente sem recusas operacionais"
    )
  }

  if (custoEstimado <= 120) {
    motivos.push(
      "Menor impacto de custo operacional previsto"
    )
  }

  if (motivos.length === 0) {
    motivos.push(
      "Compatibilidade operacional identificada pela IA"
    )
  }

  return {
    titulo: `${nome} priorizado pela IA operacional`,
    motivos,
    impactoEsperado:
      "Maior probabilidade de cobertura eficiente com redução de risco SLA.",
  }
}