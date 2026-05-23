export function Sidebar() {
  return (
    <aside className="w-[260px] min-h-screen border-r border-slate-800 bg-[#020817] p-6">
      <div className="space-y-2">
        <p className="text-blue-500 font-semibold text-sm">
          CoverMind IA
        </p>

        <h1 className="text-3xl font-bold text-white">
          Operational AI
        </h1>
      </div>

      <div className="mt-10 space-y-4">
        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-left text-white font-medium hover:bg-blue-500 transition">
          Painel Executivo
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition">
          Coberturas
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition">
          Clientes
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition">
          Postos
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition">
          Reserva Técnica
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition">
          Planos de Ação
        </button>
      </div>

      <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-sm text-slate-400">
          Status do Painel
        </p>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-white font-medium">
            Ativo
          </span>
        </div>
      </div>
    </aside>
  )
}