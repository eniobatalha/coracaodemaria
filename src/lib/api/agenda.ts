import { api } from "./client"

export type EventoEscolar = {
  id: number
  titulo: string
  descricao: string
  data: string
  categoria: "Evento" | "Reunião" | "Prova" | "Entrega" | "Feriado"
  ativo: boolean
  criado_em: string
}

function token() {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("portal_funcionario_token") ?? ""
}

export const agendaApi = {
  listar: () =>
    api.get<{ eventos: EventoEscolar[]; total: number }>("/api/v1/agenda", token()),

  criar: (dados: { titulo: string; descricao: string; data: string; categoria: string }) =>
    api.post<{ mensagem: string; evento: EventoEscolar }>("/api/v1/agenda", dados, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/agenda/${id}`, token()),
}
