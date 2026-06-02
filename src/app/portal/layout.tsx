import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal do Aluno — Coração de Maria",
  description: "Acompanhe o desempenho escolar do seu filho",
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#F0F4FF]">{children}</div>
}
