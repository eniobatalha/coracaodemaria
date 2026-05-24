import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Colégio e Curso Coração de Maria",
  description:
    "Educação eternamente abençoada. Conheça o Colégio e Curso Coração de Maria, com proposta pedagógica acolhedora, inovação, robótica e formação com valores.",
  keywords: [
    "Colégio Coração de Maria",
    "Cabo de Santo Agostinho",
    "Gaibu",
    "escola particular",
    "robótica educacional",
    "educação infantil",
    "ensino fundamental",
    "ensino médio",
  ],
  openGraph: {
    title: "Colégio e Curso Coração de Maria",
    description:
      "Educação com amor, valores e inovação para formar alunos preparados para o futuro.",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}