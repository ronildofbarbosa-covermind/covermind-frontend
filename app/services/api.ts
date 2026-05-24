const API_BASE_URL = "http://127.0.0.1:8000"

export async function buscarPainelExecutivo() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/painel-executivo-inteligente`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      throw new Error("Erro ao buscar painel executivo")
    }

    return await response.json()
  } catch (error) {
    console.error("Erro API painel:", error)
    return null
  }
}

export async function buscarRankingVaga(vagaId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ranking-operacional/${vagaId}`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      const textoErro = await response.text()

      console.error("Erro API ranking:", {
        status: response.status,
        body: textoErro,
      })

      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Erro API ranking:", error)
    return null
  }
}