/**
 * Funções de autenticação que chamam a API Coração de Maria.
 */
import { api } from "./client"

// ── Tipos de resposta da API (shape exata do JSON) ────────────────────────────

type LoginResponsavelResponse = {
  access_token: string
  token_type: string
  expires_in: number
  responsavel: {
    id: number
    nome: string
    email: string
    email_confirmado: boolean
    ativo: boolean
  }
}

type LoginFuncionarioResponse = {
  access_token: string
  token_type: string
  expires_in: number
  funcionario: {
    id: number
    nome: string
    usuario: string
    email: string
    cargo: string
    tipo: "professor" | "secretaria" | "diretora"
    ativo: boolean
  }
}

// ── Tipos de sessão armazenados no localStorage ───────────────────────────────

/** Compatível com o tipo Guardian usado nas páginas do portal do aluno. */
export type ResponsavelSession = {
  id: string
  name: string
  email: string
  access_token: string
}

/** Compatível com o tipo Employee usado no layout do portal do funcionário. */
export type FuncionarioSession = {
  id: string
  username: string
  nome: string
  cargo: string
  tipo: "professor" | "secretaria" | "diretora"
  access_token: string
}

// ── Funções de autenticação ───────────────────────────────────────────────────

export async function loginResponsavel(
  email: string,
  senha: string,
): Promise<ResponsavelSession> {
  const { access_token, responsavel } = await api.post<LoginResponsavelResponse>(
    "/api/v1/auth/responsavel/login",
    { email, senha },
  )

  return {
    id: String(responsavel.id),
    name: responsavel.nome,
    email: responsavel.email,
    access_token,
  }
}

export async function loginFuncionario(
  usuario: string,
  senha: string,
): Promise<FuncionarioSession> {
  const { access_token, funcionario } = await api.post<LoginFuncionarioResponse>(
    "/api/v1/auth/funcionario/login",
    { usuario, senha },
  )

  return {
    id: String(funcionario.id),
    username: funcionario.usuario,
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    tipo: funcionario.tipo,
    access_token,
  }
}
