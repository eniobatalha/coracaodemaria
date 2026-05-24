import { MapPin, MessageCircle, Phone } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { schoolInfo } from "@/constants/school"

export function ContactSection() {
  return (
    <section id="portal" className="bg-white py-16 sm:py-20">
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
                  href={`https://wa.me/${schoolInfo.whatsapp}`}
                  target="_blank"
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

            <div className="rounded-[2rem] bg-white p-6 text-[#071D5B]">
              <h3 className="text-2xl font-black">Contatos</h3>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <Phone className="shrink-0 text-[#E4252A]" />
                  <div>
                    <strong className="block">Unidade Cabo</strong>
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
                    <span>{schoolInfo.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#EAFBFF] p-4">
                <strong className="block">Portal do Aluno</strong>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  O acesso ao sistema de frequência, notas, pais e professores
                  será desenvolvido na próxima etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}