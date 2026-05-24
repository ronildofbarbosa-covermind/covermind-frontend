import { ConvocacaoStatus } from "./convocacao-status"

type StatusConvocacao =
  | "disponivel"
  | "convocado"
  | "aceito"
  | "recusado"
  | "timeout"

type Props = {
  posicao: number
  nome: string
  cargo: string
  score: number
  distancia: string
  custo: string
  colaboradorId: string
  status?: StatusConvocacao
}

export function CandidatoOperacionalCard({
  posicao,
  nome,
  cargo,
  score,
  distancia,
  custo,
  colaboradorId,
  status = "disponivel",
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
              TOP {posicao} · {nome}
            </h3>

            <ConvocacaoStatus status={status} />
          </div>

          <p className="text-slate-400">{cargo}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Score</p>
          <h2 className="text-4xl font-bold text-emerald-400">
            {score}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Info titulo="Distância" valor={distancia} />
        <Info titulo="Custo" valor={custo} />
        <Info titulo="ID" valor={colaboradorId} />
      </div>

      <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500">
        Convocar Colaborador
      </button>
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
      <p className="font-bold text-white">{valor}</p>
    </div>
  )
}