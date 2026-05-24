import { CheckCircle2 } from "lucide-react"
import { Container } from "@/components/ui/Container"

const pillars = [
  "Aprendizagem com significado",
  "Formação humana e valores",
  "Uso inteligente da tecnologia",
  "Participação da família",
  "Projetos interdisciplinares",
  "Acompanhamento pedagógico",
]

export function PedagogySection() {
  return (
    <section id="proposta" className="bg-[#EAFBFF] py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-bold uppercase tracking-[0.3em] text-[#E4252A]">
              Proposta pedagógica
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#071D5B] sm:text-5xl">
              Aprender com sentido, crescer com valores.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-700">
              O Coração de Maria trabalha uma educação acolhedora, atual e
              comprometida com o desenvolvimento integral dos alunos. A proposta
              valoriza conhecimento, disciplina, criatividade, convivência e
              formação para a vida.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-700">
              A escola combina ensino contextualizado, projetos educacionais e
              recursos tecnológicos para tornar a aprendizagem mais próxima da
              realidade dos estudantes.
            </p>
          </div>

          <div className="rounded-[2.5rem] bg-white p-6 shadow-xl sm:p-8">
            <h3 className="text-2xl font-black text-[#071D5B]">
              Pilares da aprendizagem
            </h3>

            <div className="mt-6 grid gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="flex items-center gap-3 rounded-2xl bg-[#EAFBFF] p-4"
                >
                  <CheckCircle2 className="shrink-0 text-[#E4252A]" />
                  <span className="font-bold text-[#071D5B]">{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}