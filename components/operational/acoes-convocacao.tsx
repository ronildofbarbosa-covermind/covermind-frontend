"use client"

import { useTransition } from "react"
import {
  aceitarConvocacao,
  recusarConvocacao,
} from "@/app/services/api"

interface Props {
  convocacaoId: number
}

export function AcoesConvocacao({
  convocacaoId,
}: Props) {
  const [pending, startTransition] = useTransition()

  async function handleAceitar() {
    startTransition(async () => {
      await aceitarConvocacao(convocacaoId)

      window.location.reload()
    })
  }

  async function handleRecusar() {
    startTransition(async () => {
      await recusarConvocacao(convocacaoId)

      window.location.reload()
    })
  }

  return (
    <div className="mt-5 flex gap-3">
      <button
        onClick={handleAceitar}
        disabled={pending}
        className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        ACEITAR
      </button>

      <button
        onClick={handleRecusar}
        disabled={pending}
        className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
      >
        RECUSAR
      </button>
    </div>
  )
}