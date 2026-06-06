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
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-5 shadow-[0_0_30px_rgba(15,23,42,0.35)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            Timeline Operacional
          </h3>

          <p className="text-sm text-slate-400">
            Eventos operacionais em tempo real
          </p>
        </div>

        <div className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-1 text-xs font-black tracking-wider text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]">
          ● AO VIVO
        </div>
      </div>

      <div className="space-y-3">
        {eventos.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-500">
            Nenhum evento operacional registrado.
          </div>
        )}

        {eventos.map((evento) => {
          const estilo = obterEstiloEvento(evento.mensagem)

          return (
            <div
              key={evento.id}
              className={`group flex gap-4 rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] ${estilo.container}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-3 w-3 rounded-full ${estilo.dot}`}
                />

                <div className="mt-1 h-full w-px bg-slate-800" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-slate-500">
                    {evento.horario}
                  </p>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${estilo.badge}`}
                  >
                    {estilo.label}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {evento.mensagem}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function obterEstiloEvento(mensagem: string) {
  const texto = mensagem.toLowerCase()

  if (texto.includes("aceitou")) {
    return {
      label: "ACEITO",
      container:
        "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-400/40",
      dot: "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]",
      badge:
        "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
    }
  }

  if (texto.includes("recusou")) {
    return {
      label: "RECUSADO",
      container:
        "border-red-500/20 bg-red-950/10 hover:border-red-400/40",
      dot: "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]",
      badge:
        "border-red-400/30 bg-red-500/15 text-red-300",
    }
  }

  if (
    texto.includes("timeout") ||
    texto.includes("não respondeu")
  ) {
    return {
      label: "TIMEOUT",
      container:
        "border-amber-500/20 bg-amber-950/10 hover:border-amber-400/40",
      dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]",
      badge:
        "border-amber-400/30 bg-amber-500/15 text-amber-300",
    }
  }

  if (texto.includes("convoc")) {
    return {
      label: "CONVOCAÇÃO",
      container:
        "border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-400/40",
      dot: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]",
      badge:
        "border-cyan-400/30 bg-cyan-500/15 text-cyan-300",
    }
  }

  return {
    label: "EVENTO",
    container:
      "border-slate-700 bg-slate-900/40 hover:border-slate-600",
    dot: "bg-slate-400",
    badge:
      "border-slate-500/30 bg-slate-500/10 text-slate-300",
  }
}