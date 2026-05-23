const API_BASE_URL = "http://127.0.0.1:8000"

export async function buscarPainelExecutivo() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/painel-executivo-inteligente`
    )

    if (!response.ok) {
      throw new Error("Erro ao buscar painel executivo")
    }

    return await response.json()

  } catch (error) {
    console.error("Erro API:", error)

    return null
  }
}