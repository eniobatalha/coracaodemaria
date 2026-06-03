import Image from "next/image"
import {
  ArrowRight,
  Baby,
  BookOpen,
  GraduationCap,
  Heart,
  Home,
  LogIn,
  Music,
  Sparkles,
  IdCardLanyard,
} from "lucide-react"
import { Container } from "@/components/ui/Container"
import { schoolInfo } from "@/constants/school"

const heroHighlights = [
  {
    title: "Maternal ao 5º ano",
    description: "Unidade Gaibu",
    icon: Baby,
    color: "text-[#0057D9]",
  },
  {
    title: "Maternal ao Médio",
    description: "Unidade Cabo",
    icon: GraduationCap,
    color: "text-[#071D5B]",
  },
  {
    title: "Balé",
    description: "Nas duas unidades",
    icon: Music,
    color: "text-[#E4252A]",
  },
  {
    title: "Biblioteca",
    description: "Incentivo à leitura",
    icon: BookOpen,
    color: "text-[#0057D9]",
  },
  {
    title: "Valores",
    description: "Formação humana",
    icon: Heart,
    color: "text-[#E4252A]",
  },
  {
    title: "Acolhimento",
    description: "Família e escola",
    icon: Home,
    color: "text-[#FF7A1C]",
  },
]

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-linear-to-br from-[#EAFBFF] via-white to-[#BDEFFF] pt-28"
    >
      <div className="absolute -right-20 top-28 h-64 w-64 rounded-full bg-[#FF7A1C]/20 blur-3xl" />
      <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#0057D9]/20 blur-3xl" />

      <Container className="grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFFFFF] px-4 py-2 text-sm font-bold text-[#071D5B] shadow-md">
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
              href="#escolher-unidade-whatsapp"
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
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071D5B] px-7 py-4 text-base font-black text-white shadow-xl transition hover:scale-105"
            >
              <LogIn size={20} />
              Acessar Portal do Aluno
            </a>

            <a
              href="/portal-funcionario"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071D5B] px-7 py-4 text-base font-black text-white shadow-xl ring-2 ring-[#FFFFFF]/70 transition hover:scale-105"
            >
              <IdCardLanyard size={20} />
              Acessar Portal do Funcionário
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {heroHighlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-[#071D5B]/5"
                >
                  <Icon className={`mb-2 ${item.color}`} size={24} />
                  <strong className="block text-sm text-[#071D5B] sm:text-base">
                    {item.title}
                  </strong>
                  <span className="text-xs text-slate-600 sm:text-sm">
                    {item.description}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-sm overflow-hidden rounded-[2.5rem] bg-[#0057D9] shadow-2xl md:max-w-md lg:max-w-lg">
            <Image
              src="/images/hero-aluna.png"
              alt="Aluna do Colégio e Curso Coração de Maria"
              width={1000}
              height={1250}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  )
}