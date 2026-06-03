export type AnalyticsExecutivos = {
  filialMaisCritica: string
  filialMaisEstavel: string
  maiorPressaoRegional: string
  taxaCobertura: string
  taxaAceite: string
  taxaRecusa: string
  tmc: string
  tma: string
  tmd: string
  tendenciaOperacional: number
}

export function obterAnalyticsExecutivos(): AnalyticsExecutivos {
  return {
    taxaCobertura: "96%",
    taxaAceite: "82%",
    taxaRecusa: "18%",
    tmc: "1h15min",
    tma: "13min",
    tmd: "57min",
    tendenciaOperacional: 12,
    filialMaisCritica: "FLORIANÓPOLIS",
    filialMaisEstavel: "JOINVILLE",
    maiorPressaoRegional: "CURITIBA",
  }
}