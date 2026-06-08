export type NivelOperacional =
  | "NORMAL"
  | "ALERTA"
  | "CRITICO"

type EntradaMotorIA = {
  reincidencias: number
  postosCriticos: number
  reservaAtencao: number
}

export type DecisaoIA = {
  nivel: NivelOperacional
  titulo: string
  descricao: string
  recomendacao: string
  impacto: string
}

export function gerarDecisaoIA({
  reincidencias,
  postosCriticos,
  reservaAtencao,
}: EntradaMotorIA): DecisaoIA {
  const scoreRisco =
    reincidencias * 3 +
    postosCriticos * 2 +
    reservaAtencao

  if (scoreRisco >= 10) {
    return {
      nivel: "CRITICO",

      titulo:
        "Risco elevado de degradação operacional",

      descricao:
        "A operação apresenta reincidências críticas e pressão operacional elevada.",

      recomendacao:
        "Acionar reserva técnica imediatamente e escalar supervisão regional.",

      impacto:
        "Redução imediata do risco de quebra SLA e mitigação de abandono operacional.",
    }
  }

  if (scoreRisco >= 5) {
    return {
      nivel: "ALERTA",

      titulo:
        "Oscilação operacional monitorada",

      descricao:
        "A operação apresenta sinais moderados de pressão operacional.",

      recomendacao:
        "Monitorar recusas e reforçar cobertura preventiva nas próximas horas.",

      impacto:
        "Maior estabilidade operacional e prevenção de reincidências.",
    }
  }

  return {
    nivel: "NORMAL",

    titulo:
      "Operação estabilizada",

    descricao:
      "Os indicadores operacionais permanecem dentro do padrão esperado.",

    recomendacao:
      "Manter monitoramento preventivo e acompanhamento operacional padrão.",

    impacto:
      "Operação saudável com baixo risco de degradação.",
  }
}