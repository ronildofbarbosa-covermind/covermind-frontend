type Props = {
  titulo: string
  valor: string
  descricao: string
}

export function IndicadorCard({
  titulo,
  valor,
  descricao,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <p className="text-sm text-slate-400">
        {titulo}
      </p>

      <h3 className="mt-3 text-4xl font-bold text-white">
        {valor}
      </h3>

      <p className="mt-3 text-sm text-slate-400">
        {descricao}
      </p>
    </div>
  )
}