import { Baby, GraduationCap, School, Users } from "lucide-react"
import { Container } from "@/components/ui/Container"

const segments = [
  {
    title: "Educação Infantil",
    description:
      "Primeiros passos com afeto, ludicidade, socialização e desenvolvimento integral.",
    icon: Baby,
  },
  {
    title: "Ensino Fundamental",
    description:
      "Base forte em leitura, escrita, matemática, ciências, valores e autonomia.",
    icon: School,
  },
  {
    title: "Ensino Médio",
    description:
      "Preparação acadêmica, projeto de vida, responsabilidade e visão de futuro.",
    icon: GraduationCap,
  },
  {
    title: "Curso",
    description:
      "Acompanhamento e reforço para fortalecer o desempenho escolar dos alunos.",
    icon: Users,
  },
]

export function SegmentsSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#071D5B] via-[#0a2470] to-[#071D5B] py-16 text-white sm:py-20">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0057D9]/25 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#E4252A]/15 blur-3xl" />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="font-bold uppercase tracking-[0.3em] text-[#FF7A1C]">
              Segmentos
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Educação para cada fase da vida escolar.
            </h2>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Da infância aos anos mais avançados, a escola acompanha o aluno
              com cuidado, método e atenção ao desenvolvimento.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {segments.map((segment) => {
              const Icon = segment.icon

              return (
                <article
                  key={segment.title}
                  className="rounded-[2rem] bg-white/15 p-6 ring-1 ring-white/20"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#071D5B]">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-black">{segment.title}</h3>

                  <p className="mt-3 leading-7 text-blue-100">
                    {segment.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}