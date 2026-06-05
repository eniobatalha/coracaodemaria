const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, text)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>("GET", path, undefined, token),
  post: <T>(path: string, body: unknown, token?: string) => request<T>("POST", path, body, token),
  put: <T>(path: string, body: unknown, token?: string) => request<T>("PUT", path, body, token),
  delete: <T>(path: string, token?: string) => request<T>("DELETE", path, undefined, token),
}

export { ApiError }
