interface KPIProps {
  titulo: string
  valor: string | number
  descricao: string
}

export function KPICard({
  titulo,
  valor,
  descricao,
}: KPIProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-slate-400 text-sm">
        {titulo}
      </p>

      <h2 className="mt-4 text-5xl font-bold text-white">
        {valor}
      </h2>

      <p className="mt-6 text-sm text-blue-400">
        {descricao}
      </p>
    </div>
  )
}