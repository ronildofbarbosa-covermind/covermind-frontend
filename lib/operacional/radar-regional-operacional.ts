type EntradaRadarRegional = {
  filial: string
  risco: number
  reincidencias: number
  recusas: number
  sla: number
}

export type RadarRegionalOperacional = {
  status: "ESTAVEL" | "ATENCAO" | "CRITICO"
  mensagem: string
  scorePressao: number
}

export function gerarRadarRegionalOperacional({
  filial,
  risco,
  reincidencias,
  recusas,
  sla,
}: EntradaRadarRegional): RadarRegionalOperacional {
  const scorePressao =
    risco * 0.4 +
    reincidencias * 10 +
    recusas * 6 +
    (100 - sla) * 0.3

  if (scorePressao >= 70) {
    return {
      status: "CRITICO",
      scorePressao: Math.round(scorePressao),
      mensagem: `Pressão operacional crítica identificada na filial ${filial}.`,
    }
  }

  if (scorePressao >= 40) {
    return {
      status: "ATENCAO",
      scorePressao: Math.round(scorePressao),
      mensagem: `Oscilação operacional moderada na filial ${filial}.`,
    }
  }

  return {
    status: "ESTAVEL",
    scorePressao: Math.round(scorePressao),
    mensagem: `Operação regional estabilizada na filial ${filial}.`,
  }
}