/**
 * Cliente HTTP leve para a API Coração de Maria.
 * Usa fetch nativo com timeout via AbortController — sem dependências externas.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
const TIMEOUT_MS = 8_000

// ── Tipos ──────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: Record<string, unknown>,
  ) {
    super((body.erro as string) ?? "Erro na requisição")
    this.name = "ApiError"
  }
}

// ── Núcleo ────────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  init: RequestInit,
  token?: string,
): Promise<T> {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    })

    if (res.status === 204) return undefined as T

    const body = await res.json().catch(() => ({}))

    if (!res.ok) throw new ApiError(res.status, body)

    return body as T
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(408, { erro: "O servidor demorou demais para responder. Tente novamente." })
    }
    throw err
  } finally {
    clearTimeout(tid)
  }
}

// ── API pública ───────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, { method: "GET" }, token),

  post: <T>(path: string, data: unknown, token?: string) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }, token),

  put: <T>(path: string, data: unknown, token?: string) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(data) }, token),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: "DELETE" }, token),
}
