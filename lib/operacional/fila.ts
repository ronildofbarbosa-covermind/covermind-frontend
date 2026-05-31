import { ItemFilaOperacional } from "@/types/fila"

export function obterFilaConvocacao(
  fila: ItemFilaOperacional[]
): ItemFilaOperacional[] {
  const filaMap = new Map<string, ItemFilaOperacional>()

  for (const item of fila) {
    filaMap.set(item.colaborador_id, item)
  }

  return Array.from(filaMap.values()).sort((a, b) => {
    const ordemA = a.posicao ?? a.ordem_fila ?? a.ordem_convocacao ?? 999
    const ordemB = b.posicao ?? b.ordem_fila ?? b.ordem_convocacao ?? 999

    return ordemA - ordemB
  })
}