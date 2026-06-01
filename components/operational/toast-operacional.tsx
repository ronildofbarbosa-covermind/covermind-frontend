"use client"

type Props = {
  mensagem: string
}

export function ToastOperacional({
  mensagem,
}: Props) {
  if (!mensagem) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-pulse">
      <div className="rounded-2xl border border-emerald-500/30 bg-[#02140d] px-5 py-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400" />

          <div>
            <p className="text-sm font-bold text-emerald-400">
              Operação Atualizada
            </p>

            <p className="text-xs text-slate-300">
              {mensagem}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}