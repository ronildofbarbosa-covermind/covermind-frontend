"use client"

import { useEffect, useState } from "react"

import { buscarFilaVaga } from "@/app/services/api"
import { obterFilaConvocacao } from "@/lib/operacional/fila"
import {
  obterStatusOperacional,
  StatusOperacional,
} from "@/lib/operacional/status-operacional"
import { obterTop5Ranking } from "@/lib/ranking/top5"
import { ItemFilaOperacional } from "@/types/fila"

export type EventoTimelineOperacional = {
  id: string
  horario: string
  mensagem: string
}

export type StatusGlobalOperacional = {
  status: StatusOperacional
  mensagem: string
}

type RetornoHook = {
  fila: ItemFilaOperacional[]
  top5: ItemFilaOperacional[]
  loading: boolean
  erro: string | null
  ultimaAtualizacao: Date | null
  mensagemOperacional: string
  eventos: EventoTimelineOperacional[]
  statusGlobal: StatusGlobalOperacional
}

export function useFilaOperacional(ocorrenciaId: string): RetornoHook {
  const [fila, setFila] = useState<ItemFilaOperacional[]>([])
  const [top5, setTop5] = useState<ItemFilaOperacional[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null)
  const [mensagemOperacional, setMensagemOperacional] = useState("")
  const [eventos, setEventos] = useState<EventoTimelineOperacional[]>([])
  const [statusGlobal, setStatusGlobal] =
    useState<StatusGlobalOperacional>({
      status: "NORMAL",
      mensagem: "Fila operacional saudável",
    })

  useEffect(() => {
    let ativo = true

    function registrarEvento(mensagem: string) {
      const agora = new Date()

      setEventos((anteriores) =>
        [
          {
            id: `${agora.getTime()}-${Math.random()}`,
            horario: agora.toLocaleTimeString("pt-BR"),
            mensagem,
          },
          ...anteriores,
        ].slice(0, 10)
      )
    }

    async function carregar() {
      try {
        setErro(null)

        const resposta = await buscarFilaVaga(ocorrenciaId)
        const filaOriginal: ItemFilaOperacional[] = resposta?.fila ?? []
        const filaProcessada = obterFilaConvocacao(filaOriginal)
        const ranking = obterTop5Ranking(filaProcessada)
        const statusAtual = obterStatusOperacional(filaProcessada)

        if (!ativo) return

        setFila((anterior) => {
          const mudou =
            JSON.stringify(anterior) !== JSON.stringify(filaProcessada)

          if (mudou && anterior.length > 0) {
            const aceito = filaProcessada.find(
              (item) => item.status === "aceito"
            )

            const recusado = filaProcessada.find(
              (item) => item.status === "recusado"
            )

            const timeout = filaProcessada.find(
              (item) => item.status === "timeout"
            )

            let mensagem = "Fila operacional sincronizada"

            if (aceito) {
              mensagem = `${
                aceito.nome ?? aceito.colaborador_id
              } aceitou a convocação`
            } else if (recusado) {
              mensagem = `${
                recusado.nome ?? recusado.colaborador_id
              } recusou a convocação`
            } else if (timeout) {
              mensagem = `${
                timeout.nome ?? timeout.colaborador_id
              } não respondeu no tempo limite`
            }

            setMensagemOperacional(mensagem)
            registrarEvento(mensagem)

            setTimeout(() => {
              setMensagemOperacional("")
            }, 4000)
          }

          return filaProcessada
        })

        setTop5(ranking)
        setStatusGlobal(statusAtual)
        setUltimaAtualizacao(new Date())
      } catch (error) {
        console.error(error)

        if (!ativo) return

        setErro("Erro ao carregar fila operacional")
      } finally {
        if (ativo) {
          setLoading(false)
        }
      }
    }

    carregar()

    const interval = setInterval(() => {
      carregar()
    }, 5000)

    return () => {
      ativo = false
      clearInterval(interval)
    }
  }, [ocorrenciaId])

  return {
    fila,
    top5,
    loading,
    erro,
    ultimaAtualizacao,
    mensagemOperacional,
    eventos,
    statusGlobal,
  }
}
