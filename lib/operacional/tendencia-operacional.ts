export type TendenciaOperacional =
  | "RECUPERANDO"
  | "ESTAVEL"
  | "PIORANDO"
  | "CRITICO"

type EntradaTendencia = {
  scoreAtual: number
  scoreAnterior: number
}

export type AnaliseTendencia = {
  tendencia: TendenciaOperacional
  mensagem: string
  variacao: number
}

export function analisarTendenciaOperacional({
  scoreAtual,
  scoreAnterior,
}: EntradaTendencia): AnaliseTendencia {
  const variacao = scoreAtual - scoreAnterior

  if (scoreAtual >= 20) {
    return {
      tendencia: "CRITICO",
      variacao,
      mensagem:
        "Escalada operacional crítica detectada.",
    }
  }

  if (variacao >= 4) {
    return {
      tendencia: "PIORANDO",
      variacao,
      mensagem:
        "Aumento consistente do risco operacional.",
    }
  }

  if (variacao <= -4) {
    return {
      tendencia: "RECUPERANDO",
      variacao,
      mensagem:
        "Recuperação operacional identificada.",
    }
  }

  return {
    tendencia: "ESTAVEL",
    variacao,
    mensagem:
      "Operação permanece estável.",
  }
}