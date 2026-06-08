type EntradaScoreConfiabilidade = {
  taxaAceite: number | string
  taxaRecusa: number | string
  taxaAtraso: number | string
  coberturasRealizadas: number | string
  reincidencias: number | string
}

export type ScoreConfiabilidade = {
  score: number
  nivel: "ALTO" | "MODERADO" | "BAIXO"
  mensagem: string
}

function numeroSeguro(valor: number | string): number {
  if (typeof valor === "number") {
    return Number.isFinite(valor) ? valor : 0
  }

  const normalizado = Number(
    valor
      .replace("%", "")
      .replace(",", ".")
      .trim()
  )

  return Number.isFinite(normalizado) ? normalizado : 0
}

export function calcularScoreConfiabilidade({
  taxaAceite,
  taxaRecusa,
  taxaAtraso,
  coberturasRealizadas,
  reincidencias,
}: EntradaScoreConfiabilidade): ScoreConfiabilidade {
  const aceite = numeroSeguro(taxaAceite)
  const recusa = numeroSeguro(taxaRecusa)
  const atraso = numeroSeguro(taxaAtraso)
  const coberturas = numeroSeguro(coberturasRealizadas)
  const reincidencia = numeroSeguro(reincidencias)

  let score = 100

  score += aceite * 0.4
  score -= recusa * 0.5
  score -= atraso * 0.4
  score += coberturas * 0.8
  score -= reincidencia * 6

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 85) {
    return {
      score,
      nivel: "ALTO",
      mensagem: "Colaborador com alta estabilidade operacional.",
    }
  }

  if (score >= 60) {
    return {
      score,
      nivel: "MODERADO",
      mensagem: "Operação monitorada com estabilidade moderada.",
    }
  }

  return {
    score,
    nivel: "BAIXO",
    mensagem: "Risco operacional elevado identificado.",
  }
}