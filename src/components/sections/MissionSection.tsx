import { Eye, Heart, Target } from "lucide-react"
import { Container } from "@/components/ui/Container"

const items = [
  {
    title: "Missão",
    description:
      "Oferecer educação de qualidade, com acolhimento, valores e compromisso com a formação integral dos alunos.",
    icon: Target,
  },
  {
    title: "Visão",
    description:
      "Ser reconhecida como uma escola de referência pela qualidade pedagógica, inovação e cuidado com cada estudante.",
    icon: Eye,
  },
  {
    title: "Valores",
    description:
      "Amor, respeito, responsabilidade, fé, ética, parceria com a família e compromisso com a aprendizagem.",
    icon: Heart,
  },
]

export function MissionSection() {
  return (
    <section id="missao" className="bg-[#EAFBFF] py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-bold uppercase tracking-[0.3em] text-[#E4252A]">
            Missão, visão e valores
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#071D5B] sm:text-5xl">
            Educação com propósito.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="overflow-hidden rounded-[2rem] bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-1.5 bg-linear-to-r from-[#071D5B] via-[#0057D9] to-[#071D5B]" />
                <div className="p-7 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#071D5B] to-[#0057D9] text-white shadow-lg">
                    <Icon size={30} />
                  </div>

                  <h3 className="text-2xl font-black text-[#071D5B]">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-700">
                    {item.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}