import { api } from "./client"

export type Comunicado = {
  id: number
  titulo: string
  conteudo: string
  urgente: boolean
  destinatario: string
  destinatario_label: string
  ativo: boolean
  criado_em: string
}

function token() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("portal_funcionario_token") ?? ""
}

export const comunicadosApi = {
  listar: () =>
    api.get<{ comunicados: Comunicado[]; total: number }>("/api/v1/comunicados", token()),

  criar: (dados: {
    titulo: string
    conteudo: string
    urgente: boolean
    destinatario: string
    destinatario_label: string
  }) =>
    api.post<{ mensagem: string; comunicado: Comunicado }>("/api/v1/comunicados", dados, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/comunicados/${id}`, token()),
}
