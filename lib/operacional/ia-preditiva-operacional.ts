export type NivelRiscoPreditivo =
  | "BAIXO"
  | "MODERADO"
  | "ALTO"
  | "CRITICO"

type EntradaPreditiva = {
  reincidencias: number
  recusas: number
  timeout: number
  postosCriticos: number
  reservaAtencao: number
}

export type AnalisePreditiva = {
  score: number
  nivel: NivelRiscoPreditivo
  riscoSLA: number
  riscoAbandono: number
  riscoReincidencia: number
  mensagem: string
}

export function gerarAnalisePreditiva({
  reincidencias,
  recusas,
  timeout,
  postosCriticos,
  reservaAtencao,
}: EntradaPreditiva): AnalisePreditiva {
  const score =
    reincidencias * 3 +
    recusas * 2 +
    timeout * 2 +
    postosCriticos * 2 +
    reservaAtencao

  const riscoSLA = Math.min(100, score * 4)
  const riscoAbandono = Math.min(100, score * 3)
  const riscoReincidencia = Math.min(100, score * 5)

  if (score >= 20) {
    return {
      score,
      nivel: "CRITICO",
      riscoSLA,
      riscoAbandono,
      riscoReincidencia,
      mensagem:
        "Risco crítico de degradação operacional e quebra SLA.",
    }
  }

  if (score >= 12) {
    return {
      score,
      nivel: "ALTO",
      riscoSLA,
      riscoAbandono,
      riscoReincidencia,
      mensagem:
        "Operação apresenta forte tendência de instabilidade.",
    }
  }

  if (score >= 6) {
    return {
      score,
      nivel: "MODERADO",
      riscoSLA,
      riscoAbandono,
      riscoReincidencia,
      mensagem:
        "Oscilações operacionais monitoradas preventivamente.",
    }
  }

  return {
    score,
    nivel: "BAIXO",
    riscoSLA,
    riscoAbandono,
    riscoReincidencia,
    mensagem:
      "Operação dentro do padrão saudável esperado.",
  }
}