import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal do Funcionário — Coração de Maria",
  description: "Acesso exclusivo para funcionários do Colégio e Curso Coração de Maria",
}

export default function PortalFuncionarioLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#FFF0F0]">{children}</div>
}
