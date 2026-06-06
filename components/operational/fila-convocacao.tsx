import { AcoesConvocacao } from "@/components/operational/acoes-convocacao"
import { ItemFilaOperacional } from "@/types/fila"

type Props = {
  fila: ItemFilaOperacional[]
}

export function FilaConvocacao({ fila }: Props) {
  return (
    <div className="space-y-4">
      {fila.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-slate-500">
          Nenhum colaborador na fila operacional.
        </div>
      )}

      {fila.map((item) => {
        const nome = item.nome || item.colaborador_id
        const cargo = item.cargo || "Colaborador operacional"
        const posicao =
          item.posicao ??
          item.ordem_fila ??
          item.ordem_convocacao ??
          "-"

        const score = item.score ?? item.score_ranking ?? "-"
        const tempo = item.timeout_segundos ?? 0
        const status = item.status ?? "disponivel"

        return (
          <div
            key={`${item.id}-${item.colaborador_id}-${status}`}
            className={`rounded-2xl border p-5 transition-all duration-500 ${obterEstiloCard(status)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {nome}
                </h4>

                <p className="mt-1 text-sm text-slate-400">
                  {cargo} · {item.colaborador_id}
                </p>
              </div>

              <StatusBadge status={status} />
            </div>

            <div className="mt-5 grid grid-cols-4 gap-4">
              <Info titulo="Posição" valor={posicao} />
              <Info titulo="Score" valor={score} />
              <Info
                titulo="Distância"
                valor={
                  item.distancia_km !== null &&
                  item.distancia_km !== undefined
                    ? `${item.distancia_km} km`
                    : "-"
                }
              />
              <Info titulo="Tempo" valor={`${tempo}s`} />
            </div>

            {(status === "convocado" || status === "pendente") && (
              <AcoesConvocacao convocacaoId={item.id} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function obterEstiloCard(status: string) {
  const estilos: Record<string, string> = {
    convocado:
      "border-cyan-500 bg-cyan-950/10 shadow-[0_0_20px_rgba(34,211,238,0.12)] animate-pulse",
    aceito:
      "border-emerald-500 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.18)]",
    recusado:
      "border-red-500 bg-red-950/10 shadow-[0_0_20px_rgba(239,68,68,0.12)]",
    timeout:
      "border-amber-500 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    cancelado:
      "border-slate-700 bg-slate-900/60 opacity-75",
    pendente:
      "border-yellow-500 bg-yellow-950/10 shadow-[0_0_20px_rgba(234,179,8,0.12)]",
  }

  return estilos[status] ?? "border-slate-800 bg-[#020817]"
}

function Info({
  titulo,
  valor,
}: {
  titulo: string
  valor: string | number
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="text-xl font-bold text-white">{valor}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const estilos: Record<string, string> = {
    convocado:
      "border-cyan-400/40 bg-cyan-500/20 text-cyan-300",
    aceito:
      "border-emerald-400/40 bg-emerald-500/20 text-emerald-300",
    recusado:
      "border-red-400/40 bg-red-500/20 text-red-300",
    timeout:
      "border-amber-400/40 bg-amber-500/20 text-amber-300",
    cancelado:
      "border-slate-500/40 bg-slate-500/20 text-slate-300",
    pendente:
      "border-yellow-400/40 bg-yellow-500/20 text-yellow-300",
  }

  return (
    <span
      className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wide ${
        estilos[status] ??
        "border-slate-500/40 bg-slate-500/20 text-slate-300"
      }`}
    >
      {status}
    </span>
  )
}