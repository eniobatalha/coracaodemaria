"use client"

import { useState, useEffect } from "react"
import { Plus, Save, Trash2, Check, CalendarRange } from "lucide-react"
import { loadSchoolEvents, saveSchoolEvents } from "@/lib/portal-funcionario/secretaria-data"
import type { SchoolEvent } from "@/lib/portal/types"

type Category = SchoolEvent["category"]
const CATEGORIES: Category[] = ["Evento", "Reunião", "Prova", "Entrega", "Feriado"]
const CAT_COLORS: Record<Category, string> = {
  Evento:  "bg-blue-100 text-blue-700",
  Reunião: "bg-purple-100 text-purple-700",
  Prova:   "bg-red-100 text-red-700",
  Entrega: "bg-amber-100 text-amber-700",
  Feriado: "bg-slate-100 text-slate-600",
}

const BLANK = { date: "", title: "", description: "", category: "Evento" as Category }

function formatDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

export default function AgendaPage() {
  const [events,  setEvents]  = useState<SchoolEvent[]>([])
  const [form,    setForm]    = useState(BLANK)
  const [adding,  setAdding]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [filter,  setFilter]  = useState<"all" | Category>("all")

  useEffect(() => { setEvents(loadSchoolEvents()) }, [])

  const displayed = filter === "all" ? events : events.filter((e) => e.category === filter)
  const sorted    = [...displayed].sort((a, b) => a.date.localeCompare(b.date))
  const today     = new Date().toISOString().slice(0, 10)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.title.trim()) return
    const newEv: SchoolEvent = {
      id:          `ev_${Date.now()}`,
      date:        form.date,
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
    }
    const updated = [...events, newEv].sort((a, b) => a.date.localeCompare(b.date))
    setEvents(updated)
    saveSchoolEvents(updated)
    setForm(BLANK)
    setAdding(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleDelete(id: string) {
    const updated = events.filter((e) => e.id !== id)
    setEvents(updated)
    saveSchoolEvents(updated)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">Agenda Escolar</h1>
          <p className="mt-1 text-sm text-slate-500">{events.length} eventos cadastrados</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
            <Plus size={16} /> Novo Evento
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
          <h3 className="mb-4 font-black text-[#071D5B]">Novo Evento</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Data</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Categoria</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Título</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Nome do evento..."
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Descrição</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Detalhes do evento..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2 text-sm font-black text-white hover:bg-[#a81826]">
              <Save size={15} /> Salvar Evento
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
          <Check size={16} /> Evento cadastrado com sucesso!
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...CATEGORIES] as const).map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-black transition ${
              filter === cat ? "bg-[#4A0010] text-white" : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
            }`}>
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="flex flex-col gap-3">
        {sorted.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
            <CalendarRange size={28} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-400">Nenhum evento encontrado.</p>
          </div>
        ) : (
          sorted.map((ev) => {
            const isPast = ev.date < today
            return (
              <div key={ev.id}
                className={`flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 transition ${
                  isPast ? "opacity-60 ring-slate-200" : "ring-[#C71F2D]/10"
                }`}>
                <div className="shrink-0 w-12 text-center">
                  <p className={`text-lg font-black leading-none ${isPast ? "text-slate-400" : "text-[#071D5B]"}`}>
                    {new Date(ev.date + "T00:00:00").getDate().toString().padStart(2, "0")}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {new Date(ev.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                  </p>
                  {isPast && <p className="text-[9px] font-bold text-slate-400">Passado</p>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-black text-[#071D5B]">{ev.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-black ${CAT_COLORS[ev.category]}`}>
                      {ev.category}
                    </span>
                  </div>
                  {ev.description && <p className="text-xs text-slate-500 leading-relaxed">{ev.description}</p>}
                </div>
                <button onClick={() => handleDelete(ev.id)}
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
