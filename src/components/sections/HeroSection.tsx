"use client"

import Image from "next/image"
import {
  ArrowRight,
  GraduationCap,
  Heart,
  LogIn,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/ui/Container"
import { schoolInfo } from "@/constants/school"

export function HeroSection() {
  const [isPortalNoticeOpen, setIsPortalNoticeOpen] = useState(false)

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-[#EAFBFF] via-white to-[#BDEFFF] pt-28"
    >
      <div className="absolute -right-20 top-28 h-64 w-64 rounded-full bg-[#FF7A1C]/20 blur-3xl" />
      <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#0057D9]/20 blur-3xl" />

      <Container className="grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#071D5B] shadow-md">
            <Heart size={18} className="text-[#E4252A]" />
            {schoolInfo.slogan}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-[#071D5B] sm:text-5xl lg:text-6xl">
            Educação com amor, valores e inovação.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700 sm:text-xl">
            Do acolhimento à aprendizagem, o Coração de Maria prepara alunos
            para crescer com conhecimento, confiança e propósito.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`https://wa.me/${schoolInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E4252A] px-7 py-4 text-base font-black text-white shadow-xl transition hover:scale-105"
            >
              Matricule seu filho
              <ArrowRight size={20} />
            </a>

            <a
              href="#proposta"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#071D5B] px-7 py-4 text-base font-black text-[#071D5B] transition hover:bg-[#071D5B] hover:text-white"
            >
              Conheça a escola
            </a>

            <a
              href="#portal-aluno-em-desenvolvimento"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071D5B] px-7 py-4 text-base font-black text-white shadow-xl transition hover:scale-105"
            >
              <LogIn size={20} />
              Acessar Portal do Aluno
            </a>

            <a
              href="#portal-aluno-em-desenvolvimento"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071D5B] px-7 py-4 text-base font-black text-white shadow-xl transition hover:scale-105"
            >
              <WalletCards size={20} />
              2ª Via e Pagamentos
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-4 shadow-md">
              <GraduationCap className="mb-2 text-[#0057D9]" />
              <strong className="block text-[#071D5B]">Infantil</strong>
              <span className="text-sm text-slate-600">Base afetiva</span>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-md">
              <Sparkles className="mb-2 text-[#FF7A1C]" />
              <strong className="block text-[#071D5B]">Robótica</strong>
              <span className="text-sm text-slate-600">Inovação</span>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-md">
              <Heart className="mb-2 text-[#E4252A]" />
              <strong className="block text-[#071D5B]">Valores</strong>
              <span className="text-sm text-slate-600">Formação humana</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2.5rem] bg-[#0057D9] shadow-2xl lg:max-w-lg">
            <Image
              src="/images/hero-aluna.png"
              alt="Aluna do Colégio e Curso Coração de Maria"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>

      {isPortalNoticeOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#071D5B]/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPortalNoticeOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAFBFF] text-[#071D5B]"
              aria-label="Fechar aviso"
            >
              <X size={22} />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071D5B] text-white">
              <LogIn size={30} />
            </div>

            <h2 className="text-2xl font-black text-[#071D5B]">
              Portal do Aluno em desenvolvimento
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              Em breve, pais, alunos e professores poderão acessar frequência,
              notas, comunicados e informações acadêmicas em um sistema próprio.
            </p>

            <button
              type="button"
              onClick={() => setIsPortalNoticeOpen(false)}
              className="mt-6 w-full rounded-full bg-[#E4252A] px-6 py-4 font-black text-white"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </section>
  )
}