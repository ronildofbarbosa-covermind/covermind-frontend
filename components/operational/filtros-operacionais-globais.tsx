"use client"

type Props = {
  filialSelecionada: string
  tipoServicoSelecionado: string
  dataInicio: string
  dataFim: string
  onFilialChange: (valor: string) => void
  onTipoServicoChange: (valor: string) => void
  onDataInicioChange: (valor: string) => void
  onDataFimChange: (valor: string) => void
  onAplicar: () => void
  onLimpar: () => void
}

const filiaisDisponiveis = [
  "TODAS",
  "FLORIANÓPOLIS",
  "CURITIBA",
  "JOINVILLE",
]

const tiposServicoDisponiveis = [
  "TODOS",
  "SEGURANÇA_PATRIMONIAL",
  "FACILITIES_ACESSOS",
  "FACILITIES_SERVICOS",
]

export function FiltrosOperacionaisGlobais({
  filialSelecionada,
  tipoServicoSelecionado,
  dataInicio,
  dataFim,
  onFilialChange,
  onTipoServicoChange,
  onDataInicioChange,
  onDataFimChange,
  onAplicar,
  onLimpar,
}: Props) {
  return (
    <section className="mb-8 rounded-3xl border border-slate-800 bg-[#06101f]/80 p-6 backdrop-blur-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          Filtros Operacionais Globais
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Defina filial, período e tipo de serviço para todo o cockpit operacional.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Filial
          </label>

          <select
            value={filialSelecionada}
            onChange={(event) => onFilialChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-700 bg-[#020817] px-3 text-sm text-white outline-none focus:border-blue-500"
          >
            {filiaisDisponiveis.map((filial) => (
              <option key={filial} value={filial}>
                {filial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Data inicial
          </label>

          <input
            type="date"
            value={dataInicio}
            onChange={(event) => onDataInicioChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-700 bg-[#020817] px-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Data final
          </label>

          <input
            type="date"
            value={dataFim}
            onChange={(event) => onDataFimChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-700 bg-[#020817] px-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Tipo de serviço
          </label>

          <select
            value={tipoServicoSelecionado}
            onChange={(event) =>
              onTipoServicoChange(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-700 bg-[#020817] px-3 text-sm text-white outline-none focus:border-blue-500"
          >
            {tiposServicoDisponiveis.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={onAplicar}
            className="h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Aplicar
          </button>

          <button
            type="button"
            onClick={onLimpar}
            className="h-11 rounded-xl border border-slate-700 px-4 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Limpar
          </button>
        </div>
      </div>
    </section>
  )
}