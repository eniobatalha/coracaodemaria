"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import { Container } from "@/components/ui/Container"

const galleryImages = [
  {
    src: "/images/galeria-01.jpg",
    alt: "Alunos em atividade escolar",
  },
  {
    src: "/images/galeria-02.jpg",
    alt: "Evento escolar do Coração de Maria",
  },
  {
    src: "/images/galeria-03.jpg",
    alt: "Aluno em ambiente decorado da escola",
  },
  {
    src: "/images/galeria-04.jpg",
    alt: "Atividade pedagógica com alunos",
  },
]

export function GallerySection() {
  const carouselRef = useRef<HTMLDivElement | null>(null)

  function scrollCarousel(direction: "left" | "right") {
    const carousel = carouselRef.current

    if (!carousel) {
      return
    }

    const scrollAmount = carousel.clientWidth * 0.85

    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section id="galeria" className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-bold uppercase tracking-[0.3em] text-[#E4252A]">
            Galeria
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#071D5B] sm:text-5xl">
            Momentos que mostram a vida da escola.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Atividades, eventos e experiências que fazem parte da rotina dos
            alunos.
          </p>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#071D5B] text-white shadow-xl transition hover:scale-105 lg:flex"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            ref={carouselRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
          >
            {galleryImages.map((image) => (
              <article
                key={image.src}
                className="relative aspect-[4/5] min-w-[82%] snap-center overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg sm:min-w-[46%] lg:min-w-[31%] xl:min-w-[24%]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 25vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#071D5B] text-white shadow-xl transition hover:scale-105 lg:flex"
            aria-label="Próxima foto"
          >
            <ChevronRight size={28} />
          </button>

          <div className="mt-5 flex justify-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071D5B] text-white shadow-lg"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071D5B] text-white shadow-lg"
              aria-label="Próxima foto"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          <p className="mt-3 text-center text-sm font-semibold text-slate-500 sm:hidden">
            Arraste para o lado para ver mais fotos
          </p>
        </div>
      </Container>
    </section>
  )
}