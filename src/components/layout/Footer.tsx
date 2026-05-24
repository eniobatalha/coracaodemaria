import Image from "next/image"
import { MapPin } from "lucide-react"
import { FaInstagram } from "react-icons/fa"
import { schoolInfo } from "@/constants/school"

export function Footer() {
  return (
    <footer className="bg-[#061646] py-10 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white p-3">
              <Image
                src="/images/logo-coracao-de-maria.png"
                alt="Logo do Colégio e Curso Coração de Maria"
                width={140}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>

            <div>
              <strong className="block text-xl">{schoolInfo.name}</strong>

              <span className="mt-1 block text-sm text-blue-100">
                {schoolInfo.slogan}
              </span>

              <div className="mt-4 space-y-1 text-sm text-blue-100">
                <p>Cabo: {schoolInfo.phoneCabo}</p>
                <p>Gaibu: {schoolInfo.phoneGaibu}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {schoolInfo.units.map((unit) => (
              <article
                key={unit.name}
                className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/10"
              >
                <h3 className="text-lg font-black">{unit.name}</h3>

                <a
                  href={unit.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex gap-3 text-sm leading-6 text-blue-100 transition hover:text-white"
                >
                  <MapPin className="mt-1 shrink-0 text-[#FF7A1C]" size={20} />
                  <span>{unit.address}</span>
                </a>

                <a
                  href={unit.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#071D5B] transition hover:scale-105"
                >
                  <FaInstagram size={20} className="text-[#E4252A]" />
                  {unit.instagramLabel}
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-blue-100">
          <p>
            © {new Date().getFullYear()} {schoolInfo.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}