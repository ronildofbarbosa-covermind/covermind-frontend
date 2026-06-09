"use client"

import type { UnidadeHeatmapInteligente } from "@/lib/operacional/heatmap-inteligente"

type Props = {
  unidades: UnidadeHeatmapInteligente[]
}

export function HeatmapInteligenteCard({
  unidades,
}: Props) {
  const estilos = {
    NORMAL: {
      badge:
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      glow: "border-emerald-500/20",
      barra: "bg-emerald-400",
    },

    ALERTA: {
      badge:
        "bg-amber-500/10 text-amber-300 border-amber-500/30",
      glow: "border-amber-500/20",
      barra: "bg-amber-400",
    },

    CRITICO: {
      badge:
        "bg-red-500/10 text-red-300 border-red-500/30",
      glow: "border-red-500/20",
      barra: "bg-red-400",
    },
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#071224] p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Heatmap Inteligente IA
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Pressão operacional cognitiva por filial
        </p>
      </div>

      <div className="space-y-5">
        {unidades.map((unidade) => {
          const estilo = estilos[unidade.status]

          return (
            <div
              key={unidade.filial}
              className={`rounded-xl border bg-[#020817] p-5 ${estilo.glow}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">
                    Filial monitorada
                  </p>

                  <h4 className="text-2xl font-black">
                    {unidade.filial}
                  </h4>
                </div>

                <span
                  className={`rounded-full border px-4 py-1 text-xs font-black ${estilo.badge}`}
                >
                  {unidade.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Baixa pressão</span>
                  <span>Alta pressão</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full ${estilo.barra}`}
                    style={{
                      width: `${Math.min(
                        100,
                        unidade.scorePressao
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-4xl font-black text-white">
                  {unidade.scorePressao}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#071224] p-4">
                <p className="text-xs font-bold tracking-wide text-slate-400">
                  LEITURA COGNITIVA
                </p>

                <p className="mt-2 text-sm text-slate-200">
                  {unidade.leitura}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}