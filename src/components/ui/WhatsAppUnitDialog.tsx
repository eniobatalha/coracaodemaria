import { MapPin, MessageCircle, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { createWhatsAppLink, schoolInfo } from "@/constants/school"

export function WhatsAppUnitDialog() {
    return (
        <section
            id="escolher-unidade-whatsapp"
            className="fixed inset-0 z-[2000] hidden items-center justify-center bg-[#071D5B]/65 px-4 backdrop-blur-sm target:flex"
        >
            <a
                href="#fechar"
                className="absolute inset-0 h-full w-full"
                aria-label="Fechar escolha de unidade"
            />

            <div className="relative z-[2001] w-full max-w-lg rounded-[2rem] bg-[#FFFFFF] p-6 shadow-2xl">
                <a
                    href="#fechar"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAFBFF] text-[#071D5B]"
                    aria-label="Fechar escolha de unidade"
                >
                    <X size={22} />
                </a>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071D5B] text-white">
                    <FaWhatsapp size={34} />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-black text-[#071D5B]">
                        Para qual unidade você deseja atendimento?
                    </h2>

                    <p className="mt-3 leading-7 text-slate-700">
                        Escolha a unidade para falar pelo WhatsApp e receber informações
                        sobre matrícula, turmas, valores e próximos passos.
                    </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {schoolInfo.units.map((unit) => (
                        <a
                            key={unit.name}
                            href={createWhatsAppLink(unit.shortName, unit.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-[1.5rem] bg-white p-5 text-[#071D5B] shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <strong className="block text-lg font-black">{unit.name}</strong>

                            <span className="mt-1 block text-sm font-bold text-[#E4252A]">
                                {unit.phone}
                            </span>

                            <span className="mt-4 flex gap-2 text-sm leading-6 text-slate-700">
                                <MapPin size={18} className="mt-1 shrink-0 text-[#FF7A1C]" />
                                {unit.address}
                            </span>

                            <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#071D5B] px-4 py-3 text-sm font-black text-white">
                                <FaWhatsapp size={20} />
                                Chamar esta unidade
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}