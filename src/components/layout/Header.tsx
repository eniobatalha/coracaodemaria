import Image from "next/image"
import { Menu, X } from "lucide-react"
import {
  pageNavigationItems,
  systemNavigationItems,
} from "@/constants/navigation"
import { schoolInfo } from "@/constants/school"

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-[999] w-full border-b border-slate-200 bg-white shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center">
          <Image
            src="/images/logo-coracao-de-maria.png"
            alt="Logo do Colégio e Curso Coração de Maria"
            width={180}
            height={90}
            className="h-14 w-auto object-contain"
            priority
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {pageNavigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-[#071D5B] transition hover:text-[#E4252A]"
            >
              {item.label}
            </a>
          ))}

          {systemNavigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-[#071D5B] transition hover:text-[#E4252A]"
            >
              {item.label}
            </a>
          ))}

          <a
            href={`https://wa.me/${schoolInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#E4252A] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-105"
          >
            Matricule seu filho
          </a>
        </nav>

        <a
          href="#mobile-menu"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071D5B] text-white shadow-lg lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={26} />
        </a>
      </div>

      <div
        id="mobile-menu"
        className="fixed inset-x-0 top-20 z-[1000] hidden h-[calc(100vh-80px)] bg-[#071D5B]/45 px-4 pt-4 backdrop-blur-sm target:block lg:hidden"
      >
        <a
          href="#fechar"
          className="absolute inset-0 h-full w-full"
          aria-label="Fechar menu"
        />

        <nav className="relative z-[1001] rounded-[2rem] bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <strong className="text-lg font-black text-[#071D5B]">Menu</strong>

            <a
              href="#fechar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071D5B] text-white"
              aria-label="Fechar menu"
            >
              <X size={22} />
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {pageNavigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-[#071D5B] px-5 py-4 text-base font-black text-white transition active:scale-[0.98]"
              >
                {item.label}
              </a>
            ))}

            {systemNavigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-[#071D5B] px-5 py-4 text-base font-black text-white transition active:scale-[0.98]"
              >
                {item.label}
              </a>
            ))}

            <a
              href={`https://wa.me/${schoolInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#E4252A] px-5 py-4 text-center text-base font-black text-white shadow-lg transition active:scale-[0.98]"
            >
              Matricule seu filho
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}