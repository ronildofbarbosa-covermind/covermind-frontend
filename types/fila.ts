export type StatusFilaOperacional =
  | "disponivel"
  | "fila"
  | "aguardando"
  | "pendente"
  | "convocado"
  | "aceito"
  | "recusado"
  | "timeout"
  | "cancelado"

export type ItemFilaOperacional = {
  id: number
  colaborador_id: string
  nome?: string | null
  cargo?: string | null
  status: StatusFilaOperacional | string
  status_convocacao?: StatusFilaOperacional | string | null
  posicao?: number | null
  ordem_fila?: number | null
  ordem_convocacao?: number | null
  score?: number | null
  score_ranking?: number | null
  distancia_km?: number | null
  timeout_segundos?: number | null
}

export type RespostaFilaOperacional = {
  fila?: ItemFilaOperacional[]
}