"use client"

type Props = {
  score: number
  nivel: "BAIXO" | "MODERADO" | "ALTO" | "CRITICO"
  riscoSLA: number
  riscoAbandono: number
  riscoReincidencia: number
  mensagem: string
}

export function IAPreditivaCard({
  score,
  nivel,
  riscoSLA,
  riscoAbandono,
  riscoReincidencia,
  mensagem,
}: Props) {
  const estilos = {
    BAIXO: "border-emerald-500/30 text-emerald-300",
    MODERADO: "border-amber-500/30 text-amber-300",
    ALTO: "border-orange-500/30 text-orange-300",
    CRITICO: "border-red-500/30 text-red-300",
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071224] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">IA Preditiva Operacional</h3>
          <p className="mt-1 text-sm text-slate-400">
            Projeção inteligente de risco futuro
          </p>
        </div>

        <span className={`rounded-full border px-4 py-1 text-xs font-black ${estilos[nivel]}`}>
          {nivel}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Indicador titulo="Score Preditivo" valor={score} sufixo="" />
        <Indicador titulo="Risco SLA" valor={riscoSLA} sufixo="%" />
        <Indicador titulo="Risco Abandono" valor={riscoAbandono} sufixo="%" />
        <Indicador titulo="Risco Reincidência" valor={riscoReincidencia} sufixo="%" />
      </div>

      <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="text-xs font-bold tracking-wide text-cyan-400">
          LEITURA PREDITIVA
        </p>
        <p className="mt-2 text-sm text-slate-200">{mensagem}</p>
      </div>
    </div>
  )
}

function Indicador({
  titulo,
  valor,
  sufixo,
}: {
  titulo: string
  valor: number
  sufixo: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#020817] p-4">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="mt-2 text-3xl font-black text-white">
        {valor}
        {sufixo}
      </p>
    </div>
  )
}