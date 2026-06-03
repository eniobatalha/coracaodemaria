"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, Plus, Save, Check, ClipboardList } from "lucide-react"
import {
  getTurmaByStudentId,
  loadAgenda,
  saveAgenda,
} from "@/lib/portal-funcionario/mock-data"
import { MOCK_STUDENTS } from "@/lib/portal/mock-data"
import type { AgendaEntry } from "@/lib/portal/types"

type Category = AgendaEntry["category"]

const CATEGORIES: Category[] = ["Elogio", "Participação", "Dever de casa", "Comportamento", "Observação"]

const CATEGORY_COLORS: Record<Category, string> = {
  "Elogio":        "bg-green-100 text-green-700",
  "Participação":  "bg-blue-100 text-blue-700",
  "Dever de casa": "bg-purple-100 text-purple-700",
  "Comportamento": "bg-red-100 text-red-700",
  "Observação":    "bg-amber-100 text-amber-700",
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export default function AgendaPage() {
  const { alunoId } = useParams<{ alunoId: string }>()
  const student = MOCK_STUDENTS.find((s) => s.id === alunoId)
  const turma   = getTurmaByStudentId(alunoId)

  const [entries, setEntries] = useState<AgendaEntry[]>([])
  const [form,    setForm]    = useState({ category: "Elogio" as Category, title: "", description: "" })
  const [saved,   setSaved]   = useState(false)
  const [adding,  setAdding]  = useState(false)

  useEffect(() => {
    setEntries(loadAgenda(alunoId))
  }, [alunoId])

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Aluno não encontrado.</div>
  }

  const accentColor = student.gender === "M" ? "#0057D9" : "#E4252A"

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return

    const newEntry: AgendaEntry = {
      id:          `a_${Date.now()}`,
      date:        new Date().toISOString().slice(0, 10),
      category:    form.category,
      title:       form.title.trim(),
      description: form.description.trim(),
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    saveAgenda(alunoId, updated)
    setForm({ category: "Elogio", title: "", description: "" })
    setAdding(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href={turma ? `/portal-funcionario/painel/turma/${turma.id}` : "/portal-funcionario/painel"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-100">
          <ChevronLeft size={20} className="text-[#071D5B]" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
            style={{ backgroundColor: accentColor }}>
            {getInitials(student.name)}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#071D5B]">Agenda — {student.name.split(" ")[0]}</h1>
            {turma && <p className="text-xs text-slate-500">{turma.label}</p>}
          </div>
        </div>
      </div>

      {/* Add button / Form */}
      {!adding ? (
        <button onClick={() => setAdding(true)}
          className="mb-5 inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
          <Plus size={16} />
          Novo registro
        </button>
      ) : (
        <form onSubmit={handleAdd}
          className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
          <h3 className="mb-3 font-black text-[#071D5B]">Novo Registro de Agenda</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Categoria</label>
              <select value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Título</label>
              <input type="text" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Resumo do registro..."
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Descrição</label>
              <textarea value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descreva o ocorrido ou observação em detalhes..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div className="flex gap-2">
              <button type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2 text-sm font-black text-white hover:bg-[#a81826]">
                <Save size={15} />
                Registrar
              </button>
              <button type="button" onClick={() => setAdding(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check size={16} />
          Registro salvo com sucesso!
        </div>
      )}

      {/* Entries list */}
      <div className="flex flex-col gap-3">
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
            <ClipboardList size={28} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-400">Nenhum registro na agenda ainda.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${CATEGORY_COLORS[entry.category]}`}>
                  {entry.category}
                </span>
                <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
              </div>
              <p className="font-bold text-[#071D5B]">{entry.title}</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{entry.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
