"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"

// ── Credenciais mock para demonstração ────────────────────────────────────────
const MOCK_FUNCIONARIOS: Record<string, {
  id: number; username: string; nome: string; cargo: string; tipo: string; senha: string
}> = {
  "secretaria":    { id: 1, username: "secretaria",    nome: "Ana Paula Ferreira", cargo: "Secretária",  tipo: "secretaria", senha: "123456" },
  "diretora":      { id: 2, username: "diretora",      nome: "Iraê Coelho",        cargo: "Diretora",    tipo: "diretora",   senha: "123456" },
  "paula.virginia":{ id: 3, username: "paula.virginia",nome: "Paula Virgínia",     cargo: "Professora",  tipo: "professor",  senha: "123456" },
  "luana.marcela": { id: 4, username: "luana.marcela", nome: "Luana Marcela",      cargo: "Professora",  tipo: "professor",  senha: "123456" },
}

export default function PortalFuncionarioLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Preencha usuário e senha.")
      return
    }

    setLoading(true)

    // Simula latência de rede
    setTimeout(() => {
      const user = MOCK_FUNCIONARIOS[username.toLowerCase().trim()]

      if (!user || user.senha !== password) {
        setError("Usuário ou senha incorretos.")
        setLoading(false)
        return
      }

      localStorage.setItem(
        "portal_funcionario",
        JSON.stringify({
          id:       user.id,
          username: user.username,
          nome:     user.nome,
          cargo:    user.cargo,
          tipo:     user.tipo,
        }),
      )
      localStorage.setItem("portal_funcionario_token", "mock_token_demo")

      router.push("/portal-funcionario/painel")
    }, 600)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#4A0010] via-[#C71F2D] to-[#4A0010] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-3 shadow-2xl">
            <Image
              src="/images/logo-coracao-de-maria.png"
              alt="Colégio e Curso Coração de Maria"
              width={80}
              height={80}
              className="h-full w-auto object-contain"
            />
          </div>
          <h1 className="text-center text-2xl font-black text-white">Portal do Funcionário</h1>
          <p className="text-center text-sm text-red-200">
            Acesso exclusivo para funcionários da escola
          </p>
        </div>

        <form onSubmit={handleLogin} className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#071D5B]">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome.sobrenome"
                className="w-full rounded-2xl border border-slate-200 bg-[#FFF0F0] px-4 py-3 text-[#071D5B] placeholder-slate-400 outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20"
                autoComplete="username"
                autoCapitalize="none"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#071D5B]">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-[#FFF0F0] px-4 py-3 pr-12 text-[#071D5B] placeholder-slate-400 outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-[#C71F2D]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#071D5B] py-4 font-black text-white shadow-lg transition hover:bg-[#0a2a80] disabled:opacity-70"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/portal-funcionario/recuperar-senha"
              className="text-xs text-slate-400 hover:text-[#C71F2D]"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-red-200">
          Colégio e Curso Coração de Maria · Portal do Funcionário
        </p>
      </div>
    </div>
  )
}
