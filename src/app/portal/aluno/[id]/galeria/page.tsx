"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { GalleryHorizontal, Images } from "lucide-react"
import { MOCK_STUDENTS, MOCK_GALLERY } from "@/lib/portal/mock-data"

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  return `${d} de ${months[parseInt(m) - 1]} de ${y}`
}

export default function GaleriaPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const albums = MOCK_GALLERY[studentId] ?? []

  if (!student) return null

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
          <GalleryHorizontal size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Galeria</h1>
          <p className="text-sm text-slate-500">
            {albums.length} álbu{albums.length !== 1 ? "ns" : "m"} disponíve{albums.length !== 1 ? "is" : "l"}
          </p>
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <GalleryHorizontal size={40} />
          <p className="font-bold">Nenhum álbum disponível ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/portal/aluno/${studentId}/galeria/${album.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              {/* Color cover */}
              <div
                className="flex h-32 items-center justify-center"
                style={{ backgroundColor: `${album.color}20` }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl transition group-hover:scale-110"
                  style={{ backgroundColor: album.color }}
                >
                  <Images size={28} className="text-white" />
                </div>
              </div>

              {/* Item count badge */}
              <div
                className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black text-white shadow"
                style={{ backgroundColor: album.color }}
              >
                {album.itemCount} fotos
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-black text-[#071D5B]">{album.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{formatDate(album.date)}</p>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">{album.description}</p>
              </div>

              <div className="border-t border-slate-100 px-4 py-2.5">
                <span className="text-xs font-bold" style={{ color: album.color }}>
                  Ver fotos →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
