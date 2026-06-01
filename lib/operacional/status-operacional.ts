import { ItemFilaOperacional } from "@/types/fila"

export type StatusOperacional =
  | "NORMAL"
  | "ALERTA"
  | "CRITICO"

type RetornoStatus = {
  status: StatusOperacional
  mensagem: string
}

export function obterStatusOperacional(
  fila: ItemFilaOperacional[]
): RetornoStatus {
  const recusas = fila.filter(
    (item) => item.status === "recusado"
  ).length

  const timeout = fila.some(
    (item) => item.status === "timeout"
  )

  if (timeout) {
    return {
      status: "CRITICO",
      mensagem:
        "Timeout operacional detectado",
    }
  }

  if (recusas >= 2) {
    return {
      status: "ALERTA",
      mensagem:
        "Recusas operacionais detectadas",
    }
  }

  return {
    status: "NORMAL",
    mensagem: "Fila operacional saudável",
  }
}