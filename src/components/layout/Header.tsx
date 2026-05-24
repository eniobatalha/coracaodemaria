"use client"

import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useRef } from "react"
import { navigationItems } from "@/constants/navigation"
import { schoolInfo } from "@/constants/school"

export function Header() {
  const detailsRef = useRef<HTMLDetailsElement | null>(null)

  function closeMobileMenu() {
    const details = detailsRef.current

    if (!details) {
      return
    }

    details.open = false
    details.removeAttribute("open")
  }

  function closeMobileMenuAfterClick() {
    window.setTimeout(() => {
      closeMobileMenu()
    }, 80)
  }

  return (
    <header className="fixed left-0 top-0 z-[999] w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" onClick={closeMobileMenuAfterClick} className="flex items-center">
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
          {navigationItems.map((item) => (
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

        <details ref={detailsRef} className="group lg:hidden">
          <summary className="relative z-[1002] flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full bg-[#071D5B] text-white shadow-lg [&::-webkit-details-marker]:hidden">
            <Menu size={26} className="block group-open:hidden" />
            <X size={26} className="hidden group-open:block" />
          </summary>

          <div className="fixed inset-x-0 top-20 z-[1000] h-[calc(100vh-80px)] bg-[#071D5B]/45 px-4 pt-4 backdrop-blur-sm lg:hidden">
            <button
              type="button"
              onClick={closeMobileMenu}
              className="absolute inset-0 h-full w-full"
              aria-label="Fechar menu"
            />

            <nav
              onClickCapture={closeMobileMenuAfterClick}
              className="relative z-[1001] rounded-[2rem] bg-white p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-3">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl bg-[#EAFBFF] px-5 py-4 text-base font-black text-[#071D5B] transition active:scale-[0.98]"
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
        </details>
      </div>
    </header>
  )
}