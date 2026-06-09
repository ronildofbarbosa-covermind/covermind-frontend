type EntradaSaudeCorporativa = {
  sla: number
  risco: number
  estabilidade: number
  recusas: number
  reincidencias: number
  contingencias: number
}

export type SaudeOperacionalCorporativa = {
  score: number
  status: "SAUDAVEL" | "MODERADA" | "CRITICA"
  descricao: string
}

export function calcularSaudeOperacionalCorporativa({
  sla,
  risco,
  estabilidade,
  recusas,
  reincidencias,
  contingencias,
}: EntradaSaudeCorporativa): SaudeOperacionalCorporativa {
  let score =
    sla * 0.30 +
    estabilidade * 0.25 +
    (100 - risco) * 0.20 +
    (100 - recusas * 10) * 0.10 +
    (100 - reincidencias * 5) * 0.10 +
    (100 - contingencias * 8) * 0.05

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 80) {
    return {
      score,
      status: "SAUDAVEL",
      descricao:
        "Operação corporativa estabilizada e saudável.",
    }
  }

  if (score >= 55) {
    return {
      score,
      status: "MODERADA",
      descricao:
        "Oscilações corporativas moderadas monitoradas.",
    }
  }

  return {
    score,
    status: "CRITICA",
    descricao:
      "Risco estrutural corporativo elevado identificado.",
  }
}