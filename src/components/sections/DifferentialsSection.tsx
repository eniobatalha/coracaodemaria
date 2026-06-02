import {
  Baby,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Music,
  School,
} from "lucide-react"
import { Container } from "@/components/ui/Container"

const differentials = [
  {
    title: "Educação desde o maternal",
    description:
      "Acompanhamento cuidadoso desde os primeiros anos, com acolhimento, rotina, socialização e desenvolvimento integral.",
    icon: Baby,
  },
  {
    title: "Unidade Gaibu até o 5º ano",
    description:
      "Atendimento escolar do maternal ao 5º ano, com ambiente próximo, familiar e adequado à formação das crianças.",
    icon: School,
  },
  {
    title: "Unidade Cabo até o Ensino Médio",
    description:
      "Formação do maternal ao 3º ano do Ensino Médio, acompanhando o aluno em uma trajetória escolar completa.",
    icon: GraduationCap,
  },
  {
    title: "Balé nas duas unidades",
    description:
      "Atividade que contribui para expressão corporal, disciplina, sensibilidade artística, postura e confiança.",
    icon: Music,
  },
  {
    title: "Biblioteca e incentivo à leitura",
    description:
      "Contato com livros, histórias e práticas de leitura que fortalecem imaginação, vocabulário e aprendizagem.",
    icon: BookOpen,
  },
  {
    title: "Acolhimento e valores",
    description:
      "Uma escola que valoriza respeito, responsabilidade, parceria com a família e formação humana.",
    icon: HeartHandshake,
  },
]

export function DifferentialsSection() {
  return (
    <section className="bg-[#FFFFFF] py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-bold uppercase tracking-[0.3em] text-[#E4252A]">
            Diferenciais
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#071D5B] sm:text-5xl">
            Uma escola presente em cada fase da vida escolar.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            O Coração de Maria une acolhimento, formação humana, rotina
            pedagógica e atividades que ajudam o aluno a crescer com segurança,
            autonomia e valores.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[#071D5B]/5 bg-[#FFFFFF] p-6 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFFFFF] text-[#071D5B] shadow-md">
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