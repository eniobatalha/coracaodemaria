/**
 * Cliente de API para os CRUDs de Professor, Turma e Aluno.
 */
import { api } from "./client"

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type Professor = {
  id: number
  nome: string
  usuario: string
  email: string
  cargo: string
  ativo: boolean
}

export type Turma = {
  id: number
  serie: string
  turma: string
  turno: string
  unidade: string
  label: string
  professor_id: number | null
  professor: { id: number; nome: string } | null
  total_alunos: number
  ativo: boolean
}

export type Aluno = {
  id: number
  nome: string
  genero: "M" | "F"
  matricula: string
  turma_id: number | null
  turma: { id: number; serie: string; turma: string; turno: string; unidade: string; label: string } | null
  responsavel_id: number | null
  responsavel: { id: number; nome: string; email: string } | null
  ativo: boolean
}

function token() {
  return localStorage.getItem("portal_funcionario_token") ?? ""
}

// ── Professores ───────────────────────────────────────────────────────────────

export const professoresApi = {
  listar: () =>
    api.get<{ professores: Professor[]; total: number }>("/api/v1/professores", token()),

  criar: (dados: { nome: string; usuario: string; email: string; cargo?: string; senha: string }) =>
    api.post<{ mensagem: string; professor: Professor }>("/api/v1/professores", dados, token()),

  editar: (id: number, dados: Partial<{ nome: string; usuario: string; email: string; cargo: string; senha: string; ativo: boolean }>) =>
    api.put<{ mensagem: string; professor: Professor }>(`/api/v1/professores/${id}`, dados, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/professores/${id}`, token()),
}

// ── Turmas ────────────────────────────────────────────────────────────────────

export const turmasApi = {
  listar: () =>
    api.get<{ turmas: Turma[]; total: number }>("/api/v1/turmas", token()),

  criar: (dados: { serie: string; turma: string; turno: string; unidade: string; professor_id?: number | null }) =>
    api.post<{ mensagem: string; turma: Turma }>("/api/v1/turmas", dados, token()),

  editar: (id: number, dados: Partial<{ serie: string; turma: string; turno: string; unidade: string; professor_id: number | null; ativo: boolean }>) =>
    api.put<{ mensagem: string; turma: Turma }>(`/api/v1/turmas/${id}`, dados, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/turmas/${id}`, token()),
}

// ── Responsáveis ─────────────────────────────────────────────────────────────

export type Responsavel = {
  id: number
  nome: string
  email: string
  email_confirmado: boolean
  email_pendente: string | null
  /** "confirmado" | "aguardando" | "troca_pendente" */
  status_email: "confirmado" | "aguardando" | "troca_pendente"
  ativo: boolean
}

export const responsaveisApi = {
  listar: () =>
    api.get<{ responsaveis: Responsavel[]; total: number }>("/api/v1/responsaveis", token()),

  criar: (dados: { nome: string; email: string }) =>
    api.post<{ mensagem: string; responsavel: Responsavel }>("/api/v1/responsaveis", dados, token()),

  editarNome: (id: number, nome: string) =>
    api.put<{ mensagem: string; responsavel: Responsavel }>(`/api/v1/responsaveis/${id}`, { nome }, token()),

  reenviarConfirmacao: (id: number) =>
    api.post<{ mensagem: string }>(`/api/v1/responsaveis/${id}/reenviar-confirmacao`, {}, token()),

  alterarEmail: (id: number, novo_email: string) =>
    api.post<{ mensagem: string; responsavel: Responsavel }>(`/api/v1/responsaveis/${id}/alterar-email`, { novo_email }, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/responsaveis/${id}`, token()),
}

// ── Alunos ────────────────────────────────────────────────────────────────────

export const alunosApi = {
  listar: () =>
    api.get<{ alunos: Aluno[]; total: number }>("/api/v1/alunos", token()),

  criar: (dados: { nome: string; genero: "M" | "F"; turma_id?: number | null; responsavel_id?: number | null }) =>
    api.post<{ mensagem: string; aluno: Aluno }>("/api/v1/alunos", dados, token()),

  editar: (id: number, dados: Partial<{ nome: string; genero: "M" | "F"; turma_id: number | null; responsavel_id: number | null; ativo: boolean }>) =>
    api.put<{ mensagem: string; aluno: Aluno }>(`/api/v1/alunos/${id}`, dados, token()),

  excluir: (id: number) =>
    api.delete<{ mensagem: string }>(`/api/v1/alunos/${id}`, token()),
}
