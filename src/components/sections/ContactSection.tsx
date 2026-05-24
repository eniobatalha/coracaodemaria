import { MapPin, MessageCircle, Phone } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { schoolInfo } from "@/constants/school"

export function ContactSection() {
  return (
    <section id="contato" className="bg-white py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-[2.5rem] bg-[#071D5B] shadow-2xl">
          <div className="grid gap-8 p-6 text-white sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div>
              <span className="font-bold uppercase tracking-[0.3em] text-[#FF7A1C]">
                Matrículas abertas
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-5xl">
                Garanta a vaga do seu filho no Coração de Maria.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                Fale com a equipe da escola, conheça as unidades e receba as
                informações sobre matrícula, turmas e proposta pedagógica.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#escolher-unidade-whatsapp"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E4252A] px-7 py-4 text-base font-black text-white transition hover:scale-105"
                >
                  <MessageCircle size={22} />
                  Chamar no WhatsApp
                </a>

                <a
                  href="#inicio"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-black text-[#071D5B]"
                >
                  Voltar ao início
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 text-[#071D5B] shadow-xl">
              <h3 className="text-2xl font-black">Contatos</h3>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <Phone className="shrink-0 text-[#E4252A]" />
                  <div>
                    <strong className="block">
                      Unidade Cabo (Vila Social)
                    </strong>
                    <span>{schoolInfo.phoneCabo}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="shrink-0 text-[#E4252A]" />
                  <div>
                    <strong className="block">Unidade Gaibu</strong>
                    <span>{schoolInfo.phoneGaibu}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="shrink-0 text-[#E4252A]" />
                  <div>
                    <strong className="block">Unidades</strong>
                    <span>Cabo de Santo Agostinho e Gaibu</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#EAFBFF] p-4">
                <strong className="block">Atendimento personalizado</strong>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Entre em contato para conhecer a proposta pedagógica,
                  consultar disponibilidade de turmas e receber orientações
                  sobre matrícula.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}