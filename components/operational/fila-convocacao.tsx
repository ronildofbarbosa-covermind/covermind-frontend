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

        return (
          <div
            key={`${item.id}-${item.colaborador_id}-${item.status}`}
            className="rounded-2xl border border-slate-800 bg-[#020817] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold">{nome}</h4>

                <p className="mt-1 text-sm text-slate-400">
                  {cargo} · {item.colaborador_id}
                </p>
              </div>

              <StatusBadge status={item.status} />
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

            {(item.status === "convocado" || item.status === "pendente") && (
              <AcoesConvocacao convocacaoId={item.id} />
            )}
          </div>
        )
      })}
    </div>
  )
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
      <p className="text-xl font-bold">{valor}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const estilos: Record<string, string> = {
    convocado: "bg-amber-500/20 text-amber-400",
    aceito: "bg-emerald-500/20 text-emerald-400",
    recusado: "bg-red-500/20 text-red-400",
    timeout: "bg-orange-500/20 text-orange-400",
    cancelado: "bg-slate-500/20 text-slate-300",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        estilos[status] ?? "bg-slate-500/20 text-slate-300"
      }`}
    >
      {status}
    </span>
  )
}