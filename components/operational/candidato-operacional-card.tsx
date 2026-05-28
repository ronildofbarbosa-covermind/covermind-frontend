import { ConvocacaoStatus } from "./convocacao-status"
import { ConvocarButton } from "./convocar-button"

type StatusConvocacao =
  | "disponivel"
  | "convocado"
  | "aceito"
  | "recusado"
  | "timeout"

type Props = {
  vagaId: string
  posicao: number
  nome: string
  cargo: string
  score: number
  distancia: string
  custo: string
  colaboradorId: string
  status?: StatusConvocacao
  mostrarBotaoConvocar?: boolean
}

export function CandidatoOperacionalCard({
  vagaId,
  posicao,
  nome,
  cargo,
  score,
  distancia,
  custo,
  colaboradorId,
  status = "disponivel",
  mostrarBotaoConvocar = true,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        posicao === 1
          ? "border-emerald-500 bg-[#020817]"
          : "border-slate-800 bg-[#020817]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">
              TOP {posicao} · {nome || colaboradorId}
            </h3>

            <ConvocacaoStatus status={status} />
          </div>

          <p className="text-slate-400">
            {cargo || "Cargo não informado"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            Score
          </p>

          <h2 className="text-4xl font-bold text-emerald-400">
            {score ?? 0}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Info
          titulo="Distância"
          valor={distancia || "-"}
        />

        <Info
          titulo="Custo"
          valor={custo || "-"}
        />

        <Info
          titulo="ID"
          valor={colaboradorId || "-"}
        />
      </div>

      {mostrarBotaoConvocar && (
        <ConvocarButton vagaId={vagaId} />
      )}
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
      <p className="text-sm text-slate-500">
        {titulo}
      </p>

      <p className="font-bold text-white">
        {valor}
      </p>
    </div>
  )
}