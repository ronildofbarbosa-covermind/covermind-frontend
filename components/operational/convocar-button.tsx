"use client"

import { useState } from "react"
import { orquestrarVaga } from "@/app/services/api"

type Props = {
  vagaId: string
}

export function ConvocarButton({ vagaId }: Props) {
  const [carregando, setCarregando] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function handleConvocar() {
    setCarregando(true)
    setStatus(null)

    const resposta = await orquestrarVaga(vagaId)

    if (resposta) {
      setStatus("Convocação iniciada")
    } else {
      setStatus("Erro ao convocar")
    }

    setCarregando(false)
  }

  return (
    <div>
      <button
        onClick={handleConvocar}
        disabled={carregando}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {carregando ? "Convocando..." : "Convocar Colaborador"}
      </button>

      {status && (
        <p className="mt-3 text-center text-sm text-slate-400">
          {status}
        </p>
      )}
    </div>
  )
}