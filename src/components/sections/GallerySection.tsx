import Image from "next/image"
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

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryImages.map((image) => (
                        <div
                            key={image.src}
                            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition duration-500 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}