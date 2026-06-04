"use client"

import { useState, useEffect } from "react"
import { Plus, Save, Trash2, Check, CalendarRange, AlertCircle, Loader2 } from "lucide-react"
import { agendaApi, type EventoEscolar } from "@/lib/api/agenda"

type Category = EventoEscolar["categoria"]
const CATEGORIES: Category[] = ["Evento", "Reunião", "Prova", "Entrega", "Feriado"]
const CAT_COLORS: Record<Category, string> = {
  Evento:  "bg-blue-100 text-blue-700",
  Reunião: "bg-purple-100 text-purple-700",
  Prova:   "bg-red-100 text-red-700",
  Entrega: "bg-amber-100 text-amber-700",
  Feriado: "bg-slate-100 text-slate-600",
}

const BLANK = { data: "", titulo: "", descricao: "", categoria: "Evento" as Category }

function formatDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.slice(0, 10).split("-")
  return `${day}/${m}/${y}`
}

export default function AgendaPage() {
  const [events,  setEvents]  = useState<EventoEscolar[]>([])
  const [form,    setForm]    = useState(BLANK)
  const [adding,  setAdding]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [filter,  setFilter]  = useState<"all" | Category>("all")

  useEffect(() => {
    agendaApi.listar()
      .then(r => setEvents(r.eventos))
      .catch(err => setError(err.message ?? "Erro ao carregar eventos"))
      .finally(() => setLoading(false))
  }, [])

  const displayed = filter === "all" ? events : events.filter((e) => e.categoria === filter)
  const sorted    = [...displayed].sort((a, b) => a.data.localeCompare(b.data))
  const today     = new Date().toISOString().slice(0, 10)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.data || !form.titulo.trim()) return
    try {
      const res = await agendaApi.criar({
        titulo:    form.titulo.trim(),
        descricao: form.descricao.trim(),
        data:      form.data,
        categoria: form.categoria,
      })
      setEvents(prev => [...prev, res.evento].sort((a, b) => a.data.localeCompare(b.data)))
      setForm(BLANK)
      setAdding(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar evento"
      setError(msg)
      setTimeout(() => setError(null), 5000)
    }
  }

  async function handleDelete(id: number) {
    try {
      await agendaApi.excluir(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover evento"
      setError(msg)
      setTimeout(() => setError(null), 5000)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">Agenda Escolar</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Carregando..." : `${events.length} eventos cadastrados`}
          </p>
        </div>
        {!adding && !loading && (
          <button onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
            <Plus size={16} /> Novo Evento
          </button>
        )}
      </div>

      {/* Feedback */}
      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 ring-1 ring-slate-200">
          <Loader2 size={16} className="animate-spin" /> Carregando eventos...
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check size={16} /> Evento cadastrado com sucesso!
        </div>
      )}

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
          <h3 className="mb-4 font-black text-[#071D5B]">Novo Evento</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Data</label>
              <input type="date" value={form.data}
                onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Categoria</label>
              <select value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value as Category }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Título</label>
              <input type="text" value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Nome do evento..."
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Descrição</label>
              <textarea rows={2} value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
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

      {/* Filter */}
      {!loading && (
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
      )}

      {/* Events list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {sorted.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
              <CalendarRange size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-400">Nenhum evento encontrado.</p>
            </div>
          ) : (
            sorted.map((ev) => {
              const isPast = ev.data < today
              return (
                <div key={ev.id}
                  className={`flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 transition ${
                    isPast ? "opacity-60 ring-slate-200" : "ring-[#C71F2D]/10"
                  }`}>
                  <div className="shrink-0 w-12 text-center">
                    <p className={`text-lg font-black leading-none ${isPast ? "text-slate-400" : "text-[#071D5B]"}`}>
                      {new Date(ev.data + "T00:00:00").getDate().toString().padStart(2, "0")}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      {new Date(ev.data + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                    </p>
                    {isPast && <p className="text-[9px] font-bold text-slate-400">Passado</p>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-black text-[#071D5B]">{ev.titulo}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-black ${CAT_COLORS[ev.categoria]}`}>
                        {ev.categoria}
                      </span>
                    </div>
                    {ev.descricao && (
                      <p className="text-xs text-slate-500 leading-relaxed">{ev.descricao}</p>
                    )}
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
      )}
    </div>
  )
}
