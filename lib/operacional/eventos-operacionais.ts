export type EventoOperacional = {
  id: string
  horario: string
  mensagem: string
}

export async function buscarEventosOperacionais(): Promise<EventoOperacional[]> {
  try {
    const resposta = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/eventos_operacionais?select=id,criado_em,titulo,descricao,tipo_evento&order=criado_em.desc&limit=10`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}`,
        },
        cache: "no-store",
      }
    )

    if (!resposta.ok) {
      throw new Error("Erro ao buscar eventos operacionais")
    }

    const dados = await resposta.json()

    return dados.map((evento: {
      id: number
      criado_em: string
      titulo: string
      descricao: string | null
      tipo_evento: string
    }) => ({
      id: String(evento.id),
      horario: new Date(evento.criado_em).toLocaleTimeString("pt-BR"),
      mensagem: evento.descricao || evento.titulo || evento.tipo_evento,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}