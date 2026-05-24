import { BookOpen, Bot, HeartHandshake, Lightbulb } from "lucide-react"
import { Container } from "@/components/ui/Container"

const differentials = [
  {
    title: "Robótica Aplicada",
    description:
      "Tecnologia, criatividade e resolução de problemas desde os primeiros anos escolares.",
    icon: Bot,
  },
  {
    title: "Ensino Contextualizado",
    description:
      "Aprendizagem conectada ao cotidiano do aluno, com sentido, prática e participação.",
    icon: BookOpen,
  },
  {
    title: "Projetos Educacionais",
    description:
      "Atividades que desenvolvem autonomia, expressão, raciocínio e convivência.",
    icon: Lightbulb,
  },
  {
    title: "Acolhimento Familiar",
    description:
      "Ambiente próximo, humano e cuidadoso, com parceria entre escola e família.",
    icon: HeartHandshake,
  },
]

export function DifferentialsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-bold uppercase tracking-[0.3em] text-[#E4252A]">
            Diferenciais
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#071D5B] sm:text-5xl">
            Uma escola que une cuidado, conhecimento e futuro.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            A proposta do Coração de Maria valoriza a formação completa do
            aluno, com base pedagógica sólida, inovação e princípios humanos.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {differentials.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-slate-100 bg-[#EAFBFF] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0057D9] shadow-md">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-[#071D5B]">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-700">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}