export type UnidadeHeatmapInteligente = {
  filial: string
  scorePressao: number
  status: "NORMAL" | "ALERTA" | "CRITICO"
  leitura: string
}

type EntradaHeatmap = {
  filial: string
  risco: number
  reincidencias: number
  recusas: number
  sla: number
}

export function gerarUnidadeHeatmapInteligente({
  filial,
  risco,
  reincidencias,
  recusas,
  sla,
}: EntradaHeatmap): UnidadeHeatmapInteligente {
  const scorePressao = Math.round(
    risco * 0.4 +
      reincidencias * 10 +
      recusas * 6 +
      (100 - sla) * 0.3
  )

  if (scorePressao >= 70) {
    return {
      filial,
      scorePressao,
      status: "CRITICO",
      leitura: "Pressão operacional crítica detectada.",
    }
  }

  if (scorePressao >= 40) {
    return {
      filial,
      scorePressao,
      status: "ALERTA",
      leitura: "Oscilação operacional relevante monitorada.",
    }
  }

  return {
    filial,
    scorePressao,
    status: "NORMAL",
    leitura: "Operação regional estabilizada.",
  }
}