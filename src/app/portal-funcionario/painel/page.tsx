"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Construction } from "lucide-react"

type Employee = {
  id: string
  username: string
  nome: string
  cargo: string
  tipo: "diretora" | "secretaria" | "professor"
  turmas?: string[]
}

export default function PortalFuncionarioPainelPage() {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("portal_funcionario")
    if (!data) {
      router.replace("/portal-funcionario")
      return
    }
    setEmployee(JSON.parse(data))
  }, [router])

  function handleLogout() {
    sessionStorage.removeItem("portal_funcionario")
    router.push("/portal-funcionario")
  }

  if (!employee) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF0F0] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#C71F2D]/10 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg p-2">
          <Image
            src="/images/logo-coracao-de-maria.png"
            alt="Coração de Maria"
            width={64}
            height={64}
            className="h-full w-auto object-contain"
          />
        </div>

        <h1 className="text-xl font-black text-[#071D5B]">Olá, {employee.nome}!</h1>
        <p className="mt-1 text-sm text-slate-500">{employee.cargo}</p>

        {employee.turmas && employee.turmas.length > 0 && (
          <div className="mt-3 flex flex-col gap-1">
            {employee.turmas.map((turma) => (
              <span
                key={turma}
                className="inline-block rounded-full bg-[#FFF0F0] px-3 py-1 text-xs font-bold text-[#C71F2D]"
              >
                {turma}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-amber-50 p-5">
          <Construction size={32} className="text-amber-500" />
          <p className="text-sm font-bold text-amber-800">Portal em desenvolvimento</p>
          <p className="text-xs text-amber-700">
            As funcionalidades do portal do funcionário estarão disponíveis em breve.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#071D5B] px-5 py-3 text-sm font-black text-[#071D5B] transition hover:bg-[#071D5B] hover:text-white"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  )
}
