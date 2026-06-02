"use client"

import { useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, GalleryHorizontal } from "lucide-react"
import { MOCK_GALLERY, MOCK_GALLERY_ITEMS } from "@/lib/portal/mock-data"
import { Lightbox } from "@/components/portal/Lightbox"

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string
  const albumId = params.albumId as string

  const albums = MOCK_GALLERY[studentId] ?? []
  const album = albums.find((a) => a.id === albumId)
  const items = MOCK_GALLERY_ITEMS[albumId] ?? []

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleClose = useCallback(() => setLightboxIndex(null), [])

  if (!album) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-slate-400">
        <GalleryHorizontal size={40} />
        <p className="font-bold">Álbum não encontrado</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#071D5B] shadow-sm hover:shadow-md"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">{album.title}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{album.description}</p>
          <p className="mt-1 text-xs font-bold" style={{ color: album.color }}>
            {items.length} fotos
          </p>
        </div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm"
            aria-label={`Abrir foto ${index + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnail}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
