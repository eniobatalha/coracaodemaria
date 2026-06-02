"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { MOCK_GUARDIAN, MOCK_PASSWORD } from "@/lib/portal/mock-data"

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (!email || !password) {
        setError("Preencha e-mail e senha.")
        setLoading(false)
        return
      }
      if (password !== MOCK_PASSWORD) {
        setError("E-mail ou senha incorretos.")
        setLoading(false)
        return
      }
      sessionStorage.setItem("portal_guardian", JSON.stringify(MOCK_GUARDIAN))
      router.push("/portal/alunos")
    }, 600)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#071D5B] via-[#0057D9] to-[#071D5B] px-4 py-10">
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
          <h1 className="text-center text-2xl font-black text-white">Portal do Aluno</h1>
          <p className="text-center text-sm text-blue-200">
            Acesso exclusivo para pais e responsáveis
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-white p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#071D5B]">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-[#F0F4FF] px-4 py-3 text-[#071D5B] placeholder-slate-400 outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
                autoComplete="email"
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
                  className="w-full rounded-2xl border border-slate-200 bg-[#F0F4FF] px-4 py-3 pr-12 text-[#071D5B] placeholder-slate-400 outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
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
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-[#E4252A]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#E4252A] py-4 font-black text-white shadow-lg transition hover:bg-[#c91f24] disabled:opacity-70"
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
            Demo: qualquer e-mail com senha{" "}
            <span className="font-bold text-[#071D5B]">{MOCK_PASSWORD}</span>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-blue-200">
          Colégio e Curso Coração de Maria · Portal do Responsável
        </p>
      </div>
    </div>
  )
}
