"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"

const MOCK_EMPLOYEES = [
  {
    id: "e1",
    username: "rosa.paz",
    nome: "Rosa Paz",
    cargo: "Diretora",
    tipo: "diretora" as const,
    password: "123456",
  },
  {
    id: "e2",
    username: "luana.silveira",
    nome: "Luana Silveira",
    cargo: "Secretária",
    tipo: "secretaria" as const,
    password: "123456",
  },
  {
    id: "e3",
    username: "luana.marcela",
    nome: "Luana Marcela",
    cargo: "Professora",
    tipo: "professor" as const,
    turmas: ["1º Ano A — Manhã (F1)", "1º Ano B — Tarde (F1)"],
    password: "123456",
  },
]

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
    setLoading(true)

    setTimeout(() => {
      if (!username || !password) {
        setError("Preencha usuário e senha.")
        setLoading(false)
        return
      }

      const employee = MOCK_EMPLOYEES.find(
        (emp) => emp.username === username.toLowerCase().trim() && emp.password === password
      )

      if (!employee) {
        setError("Usuário ou senha incorretos.")
        setLoading(false)
        return
      }

      sessionStorage.setItem("portal_funcionario", JSON.stringify(employee))
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

        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-white p-6 shadow-2xl"
        >
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

          <p className="mt-5 text-center text-xs text-slate-400">
            Demo:{" "}
            <span className="font-bold text-[#071D5B]">luana.marcela</span>
            {" "}com senha{" "}
            <span className="font-bold text-[#071D5B]">123456</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-red-200">
          Colégio e Curso Coração de Maria · Portal do Funcionário
        </p>
      </div>
    </div>
  )
}
