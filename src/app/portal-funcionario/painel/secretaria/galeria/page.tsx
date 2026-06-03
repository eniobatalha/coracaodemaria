"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Check, ImagePlus, Plus, Trash2, GalleryHorizontal } from "lucide-react"
import {
  loadSecGallery,
  saveSecGallery,
  type SecGalleryAlbum,
} from "@/lib/portal-funcionario/secretaria-data"

const TARGETS = [
  { value: "all",       label: "Todos os alunos"         },
  { value: "gaibu",    label: "Unidade Gaibu"            },
  { value: "cabo",     label: "Unidade Cabo"             },
  { value: "1a-manha", label: "1º Ano A — Manhã (Gaibu)" },
  { value: "1b-tarde", label: "1º Ano B — Tarde (Gaibu)" },
  { value: "4a",       label: "4º Ano A — Manhã (Cabo)"  },
]

const COLORS = ["#C71F2D", "#0057D9", "#22c55e", "#f59e0b", "#6366f1", "#ec4899", "#0ea5e9"]

const BLANK = { title: "", description: "", target: "all", color: "#C71F2D" }

function randomSeed() {
  return `ph${Math.random().toString(36).slice(2, 8)}`
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

export default function GaleriaPage() {
  const [albums,       setAlbums]       = useState<SecGalleryAlbum[]>([])
  const [form,         setForm]         = useState(BLANK)
  const [adding,       setAdding]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [expandedId,   setExpandedId]   = useState<string | null>(null)
  const [addingPhoto,  setAddingPhoto]  = useState<string | null>(null) // albumId being expanded for photo add

  useEffect(() => { setAlbums(loadSecGallery()) }, [])

  function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    const targetLabel = TARGETS.find((t) => t.value === form.target)?.label ?? "Todos"
    const newAlbum: SecGalleryAlbum = {
      id:          `sg_${Date.now()}`,
      date:        new Date().toISOString().slice(0, 10),
      title:       form.title.trim(),
      description: form.description.trim(),
      target:      form.target,
      targetLabel,
      color:       form.color,
      photos:      [],
    }
    const updated = [newAlbum, ...albums]
    setAlbums(updated)
    saveSecGallery(updated)
    setForm(BLANK)
    setAdding(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleAddPhoto(albumId: string) {
    const seed = randomSeed()
    const updated = albums.map((a) =>
      a.id === albumId ? { ...a, photos: [...a.photos, seed] } : a
    )
    setAlbums(updated)
    saveSecGallery(updated)
  }

  function handleDeletePhoto(albumId: string, seed: string) {
    const updated = albums.map((a) =>
      a.id === albumId ? { ...a, photos: a.photos.filter((p) => p !== seed) } : a
    )
    setAlbums(updated)
    saveSecGallery(updated)
  }

  function handleDeleteAlbum(id: string) {
    const updated = albums.filter((a) => a.id !== id)
    setAlbums(updated)
    saveSecGallery(updated)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">Galeria</h1>
          <p className="mt-1 text-sm text-slate-500">{albums.length} álbum{albums.length !== 1 ? "ns" : ""} · {albums.reduce((s, a) => s + a.photos.length, 0)} fotos</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
            <Plus size={16} /> Novo Álbum
          </button>
        )}
      </div>

      {/* Create album form */}
      {adding && (
        <form onSubmit={handleCreateAlbum}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
          <h3 className="mb-4 font-black text-[#071D5B]">Novo Álbum</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Título do Álbum</label>
              <input type="text" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Festa Junina — Junho 2026"
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Destinatários</label>
              <select value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20">
                {TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-[#071D5B]">Cor do Álbum</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`h-7 w-7 rounded-full transition ring-2 ${form.color === c ? "ring-offset-2 ring-[#071D5B]" : "ring-transparent"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Descrição</label>
              <input type="text" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Breve descrição do álbum..."
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2 text-sm font-black text-white hover:bg-[#a81826]">
              <Plus size={15} /> Criar Álbum
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check size={16} /> Álbum criado! Agora adicione fotos clicando em "Adicionar Foto".
        </div>
      )}

      {/* Albums grid */}
      {albums.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
          <GalleryHorizontal size={28} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-400">Nenhum álbum criado ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {albums.map((album) => {
            const isExpanded = expandedId === album.id
            return (
              <div key={album.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-[#C71F2D]/10 overflow-hidden">
                {/* Album header */}
                <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : album.id)}>
                  <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${album.color}20` }}>
                    <GalleryHorizontal size={22} style={{ color: album.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#071D5B]">{album.title}</p>
                    <p className="text-xs text-slate-500">
                      {album.targetLabel} · {formatDate(album.date)} · {album.photos.length} foto{album.photos.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleAddPhoto(album.id) }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F0] px-3 py-1.5 text-xs font-black text-[#C71F2D] hover:bg-[#FFE0E0]">
                      <ImagePlus size={13} /> Adicionar Foto
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id) }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Photos grid */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4">
                    {album.photos.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 py-8 text-center">
                        <ImagePlus size={24} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-bold text-slate-400">Nenhuma foto. Clique em "Adicionar Foto" para começar.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                        {album.photos.map((seed) => (
                          <div key={seed} className="group relative aspect-square overflow-hidden rounded-xl">
                            <Image
                              src={`https://picsum.photos/seed/${seed}/400/400`}
                              alt="Foto do álbum"
                              fill className="object-cover" sizes="120px"
                            />
                            <button
                              onClick={() => handleDeletePhoto(album.id, seed)}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                              <Trash2 size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddPhoto(album.id)}
                          className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-[#C71F2D] hover:text-[#C71F2D] transition">
                          <ImagePlus size={20} />
                          <span className="text-[10px] font-bold">Adicionar</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
