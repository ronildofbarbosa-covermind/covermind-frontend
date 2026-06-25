"use client"

import { useState } from "react"

type StatusOcorrencia =
  | "CRITICO"
  | "EM_CONVOCACAO"
  | "ALERTA"
  | "NORMAL"

type NivelImpacto = "BAIXO" | "MEDIO" | "ALTO" | "CRITICO"
type CriticidadePosto = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA"
type ClassificacaoContrato = "PADRAO" | "PREMIUM" | "VIP"

type Props = {
  id: string
  cliente: string
  posto: string
  filial: string
  cargo: string
  tipoServico: string
  status: StatusOcorrencia
  sla: string
  horarioPosto?: string
  enderecoPosto?: string
  bairroPosto?: string
  cidadePosto?: string
  estadoPosto?: string
  motivoOcorrencia?: string
  grupoOcorrencia?: string
  possuiOcupanteVinculado?: boolean
  matriculaColaborador?: string
  nomeColaborador?: string
  cargoColaborador?: string
  criticidadePosto?: CriticidadePosto
  impactoCliente?: string
  impactoSla?: string
  riscoContratual?: string
  nivelImpacto?: NivelImpacto
  scoreExecutivo?: number
  iccContrato?: number
  classificacaoContrato?: ClassificacaoContrato
  elegiveis?: number
  filaAtiva?: number
  recusas?: number
  topScore?: number
  selecionada: boolean
  onSelecionar: () => void
}

const estilosStatus = {
  CRITICO: "border-red-500/50 bg-red-950/20 text-red-300",
  EM_CONVOCACAO: "border-cyan-500/50 bg-cyan-950/20 text-cyan-300",
  ALERTA: "border-amber-500/50 bg-amber-950/20 text-amber-300",
  NORMAL: "border-emerald-500/50 bg-emerald-950/20 text-emerald-300",
}

const labelsStatus = {
  CRITICO: "Crítico",
  EM_CONVOCACAO: "Em convocação",
  ALERTA: "Alerta",
  NORMAL: "Normal",
}

const estilosImpacto = {
  BAIXO: "bg-emerald-500/20 text-emerald-300",
  MEDIO: "bg-amber-500/20 text-amber-300",
  ALTO: "bg-orange-500/20 text-orange-300",
  CRITICO: "bg-red-500/20 text-red-300",
}

const estilosContrato = {
  PADRAO: "border-slate-500/40 bg-slate-900/50 text-slate-300",
  PREMIUM: "border-violet-500/40 bg-violet-950/30 text-violet-300",
  VIP: "border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300",
}

const labelsContrato = {
  PADRAO: "Contrato Padrão",
  PREMIUM: "Contrato Premium",
  VIP: "Contrato VIP",
}

function classificarPrioridade(score: number) {
  if (score >= 401) {
    return {
      label: "Prioridade Máxima",
      className: "border-red-500/40 bg-red-950/30 text-red-300",
    }
  }

  if (score >= 301) {
    return {
      label: "Prioridade Alta",
      className: "border-orange-500/40 bg-orange-950/30 text-orange-300",
    }
  }

  if (score >= 201) {
    return {
      label: "Prioridade Média",
      className: "border-amber-500/40 bg-amber-950/30 text-amber-300",
    }
  }

  return {
    label: "Prioridade Baixa",
    className: "border-emerald-500/40 bg-emerald-950/30 text-emerald-300",
  }
}

export function CardOcorrenciaOperacional({
  id,
  cliente,
  posto,
  filial,
  cargo,
  tipoServico,
  status,
  sla,
  horarioPosto = "Horário não informado",
  enderecoPosto = "Endereço não informado",
  bairroPosto,
  cidadePosto,
  estadoPosto,
  motivoOcorrencia = "Motivo não informado",
  grupoOcorrencia = "Grupo não informado",
  possuiOcupanteVinculado = false,
  matriculaColaborador,
  nomeColaborador,
  cargoColaborador,
  criticidadePosto = "MEDIA",
  impactoCliente = "Não informado",
  impactoSla = "Não informado",
  riscoContratual = "Não informado",
  nivelImpacto = "BAIXO",
  scoreExecutivo = 0,
  iccContrato = 0,
  classificacaoContrato = "PADRAO",
  elegiveis = 0,
  filaAtiva = 0,
  recusas = 0,
  selecionada,
  onSelecionar,
}: Props) {
  const [mostrarComposicao, setMostrarComposicao] = useState(false)
  const prioridade = classificarPrioridade(scoreExecutivo)

  const enderecoCompleto = [
    enderecoPosto,
    bairroPosto,
    cidadePosto && estadoPosto ? `${cidadePosto}/${estadoPosto}` : cidadePosto || estadoPosto,
  ]
    .filter(Boolean)
    .join(" • ")

  return (
    <div
      onClick={onSelecionar}
      className={`w-full cursor-pointer rounded-2xl border p-4 text-left transition ${
        selecionada
          ? "border-blue-500 bg-blue-950/20 shadow-[0_0_30px_rgba(37,99,235,0.15)]"
          : "border-slate-800 bg-[#020817] hover:border-slate-600"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${estilosStatus[status]}`}
        >
          {labelsStatus[status]}
        </span>

        <span className="text-xs text-slate-500">{id}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.8fr)]">
        <div className="space-y-2">
          <div className="rounded-xl border border-slate-800 bg-[#06101f] p-3">
            <p className="text-sm font-bold uppercase tracking-wide text-white">
              {cliente} · {posto}
            </p>

            <p className="mt-2 text-xs font-semibold text-slate-200">
              🕒 {horarioPosto}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              📍 {enderecoCompleto}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase">
              <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                Filial {filial}
              </span>

              <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">
                {cargo}
              </span>

              <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-400">
                {tipoServico}
              </span>
            </div>
          </div>

          <div className="grid gap-2 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#06101f] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Cobertura
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {motivoOcorrencia}
              </p>

              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400">{grupoOcorrencia}</span>

                <span className="font-semibold text-slate-300">
                  Posto {criticidadePosto}
                </span>
              </div>
            </div>

            {possuiOcupanteVinculado && (
              <div className="rounded-xl border border-slate-800 bg-[#06101f] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Colaborador
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {matriculaColaborador ?? "-"} ·{" "}
                  {nomeColaborador ?? "Nome não informado"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {cargoColaborador ?? "Cargo não informado"}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#06101f] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Impacto operacional
            </p>

            <p className="mt-1 text-xs text-slate-300">{impactoCliente}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">
                SLA {impactoSla}
              </span>

              <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300">
                CONTRATO {riscoContratual}
              </span>

              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${estilosImpacto[nivelImpacto]}`}
              >
                IMPACTO {nivelImpacto}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-blue-300">
                Score Executivo
              </span>

              <span className="text-2xl font-bold text-blue-200">
                {scoreExecutivo}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${prioridade.className}`}
              >
                {prioridade.label}
              </span>

              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${estilosContrato[classificacaoContrato]}`}
              >
                ICC {iccContrato} · {labelsContrato[classificacaoContrato]}
              </span>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setMostrarComposicao((valorAtual) => !valorAtual)
              }}
              className="mt-2 text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              {mostrarComposicao ? "Ocultar prioridade" : "Entender prioridade"}
            </button>

            {mostrarComposicao && (
              <div className="mt-3 rounded-xl border border-slate-800 bg-[#020817] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Motivos da prioridade
                </p>

                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p>✓ Status: {labelsStatus[status]}</p>
                  <p>✓ Impacto operacional: {nivelImpacto}</p>
                  <p>✓ Risco contratual: {riscoContratual}</p>
                  <p>✓ Criticidade do posto: {criticidadePosto}</p>
                  <p>✓ Elegíveis disponíveis: {elegiveis}</p>
                  <p>✓ Fila ativa: {filaAtiva}</p>
                  <p>✓ Recusas: {recusas}</p>
                  <p>✓ ICC do contrato: {iccContrato}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Info label="SLA" valor={sla} />
            <Info label="Elegíveis" valor={elegiveis} />
            <Info label="Fila" valor={filaAtiva} />
            <Info label="Recusas" valor={recusas} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({
  label,
  valor,
}: {
  label: string
  valor: string | number
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#06101f] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-white">{valor}</p>
    </div>
  )
}

export type {
  StatusOcorrencia,
  NivelImpacto,
  CriticidadePosto,
  ClassificacaoContrato,
}