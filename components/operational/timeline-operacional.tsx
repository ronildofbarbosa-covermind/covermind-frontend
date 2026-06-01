"use client"

type EventoTimeline = {
  id: string
  horario: string
  mensagem: string
}

type Props = {
  eventos: EventoTimeline[]
}

export function TimelineOperacional({
  eventos,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">
            Timeline Operacional
          </h3>

          <p className="text-sm text-slate-400">
            Eventos operacionais em tempo real
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
          AO VIVO
        </div>
      </div>

      <div className="space-y-3">
        {eventos.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
            Nenhum evento operacional registrado.
          </div>
        )}

        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="flex gap-4 rounded-xl border border-slate-800 bg-[#020817] p-4"
          >
            <div className="mt-1 h-3 w-3 rounded-full bg-emerald-400" />

            <div className="flex-1">
              <p className="text-xs text-slate-500">
                {evento.horario}
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {evento.mensagem}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}