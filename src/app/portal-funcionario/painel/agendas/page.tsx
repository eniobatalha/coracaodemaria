"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ClipboardList, Plus } from "lucide-react"
import { TEACHER_CLASSES, getStudentsByTurma, loadAgenda } from "@/lib/portal-funcionario/mock-data"
import type { AgendaEntry } from "@/lib/portal/types"
import type { Student } from "@/lib/portal/types"

type Category = AgendaEntry["category"]

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

function formatDate(d: string) {
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

type StudentWithEntries = {
  student: Student
  entries: AgendaEntry[]
  turmaLabel: string
  turmaId: string
}

export default function AgendasPage() {
  const [data, setData] = useState<StudentWithEntries[]>([])
  const [filterClass, setFilterClass] = useState<string>("all")
  const [filterCat,   setFilterCat]   = useState<Category | "all">("all")

  useEffect(() => {
    const rows: StudentWithEntries[] = []
    for (const turma of TEACHER_CLASSES) {
      for (const student of getStudentsByTurma(turma.id)) {
        rows.push({
          student,
          entries: loadAgenda(student.id),
          turmaLabel: turma.label,
          turmaId: turma.id,
        })
      }
    }
    setData(rows)
  }, [])

  const filteredData = data
    .map((row) => ({
      ...row,
      entries: row.entries.filter((e) => filterCat === "all" || e.category === filterCat),
    }))
    .filter((row) =>
      (filterClass === "all" || row.turmaId === filterClass) &&
      row.entries.length > 0
    )

  const totalEntries = data.reduce((s, r) => s + r.entries.length, 0)

  const allCategories: Category[] = ["Elogio", "Participação", "Dever de casa", "Comportamento", "Observação"]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Agenda Individual</h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalEntries} registro{totalEntries !== 1 ? "s" : ""} · {data.length} aluno{data.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {/* By class */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterClass("all")}
            className={`rounded-full px-3 py-1 text-xs font-black transition ${
              filterClass === "all" ? "bg-[#4A0010] text-white" : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
            }`}>
            Todas as turmas
          </button>
          {TEACHER_CLASSES.map((t) => (
            <button key={t.id} onClick={() => setFilterClass(t.id)}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                filterClass === t.id ? "bg-[#4A0010] text-white" : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}>
              {t.shortLabel}
            </button>
          ))}
        </div>

        <div className="w-full h-px bg-slate-100 sm:hidden" />

        {/* By category */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterCat("all")}
            className={`rounded-full px-3 py-1 text-xs font-black transition ${
              filterCat === "all" ? "bg-[#071D5B] text-white" : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
            }`}>
            Todas categorias
          </button>
          {allCategories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                filterCat === cat
                  ? "bg-[#071D5B] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Student agenda cards */}
      {filteredData.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
          <ClipboardList size={28} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-400">Nenhum registro encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredData.map(({ student, entries, turmaLabel }) => {
            const accentColor = student.gender === "M" ? "#0057D9" : "#E4252A"
            const recent = entries.slice(0, 3)

            return (
              <div key={student.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-[#C71F2D]/10">
                {/* Student header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                    style={{ backgroundColor: accentColor }}>
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#071D5B]">{student.name}</p>
                    <p className="text-xs text-slate-500">{turmaLabel} · {entries.length} registro{entries.length !== 1 ? "s" : ""}</p>
                  </div>
                  <Link href={`/portal-funcionario/painel/aluno/${student.id}/agenda`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#C71F2D] px-3 py-1.5 text-xs font-black text-white hover:bg-[#a81826]">
                    <Plus size={13} />
                    Registrar
                  </Link>
                </div>

                {/* Recent entries */}
                <div className="px-4 py-3 flex flex-col gap-2">
                  {recent.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${CATEGORY_COLORS[entry.category]}`}>
                        {entry.category}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#071D5B] leading-snug">{entry.title}</p>
                        <p className="text-xs text-slate-400">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                  ))}
                  {entries.length > 3 && (
                    <Link href={`/portal-funcionario/painel/aluno/${student.id}/agenda`}
                      className="text-xs font-bold text-[#C71F2D] hover:underline">
                      + {entries.length - 3} registro{entries.length - 3 > 1 ? "s" : ""} anterior{entries.length - 3 > 1 ? "es" : ""}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Students with no entries */}
      {(() => {
        const withoutEntries = data.filter((r) =>
          (filterClass === "all" || r.turmaId === filterClass) && r.entries.length === 0
        )
        if (withoutEntries.length === 0) return null
        return (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">Sem registros ainda</p>
            <div className="flex flex-wrap gap-2">
              {withoutEntries.map(({ student }) => (
                <Link key={student.id}
                  href={`/portal-funcionario/painel/aluno/${student.id}/agenda`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-[#FFF0F0] hover:text-[#C71F2D] transition ring-1 ring-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white"
                    style={{ backgroundColor: student.gender === "M" ? "#0057D9" : "#E4252A" }}>
                    {getInitials(student.name)}
                  </div>
                  {student.name.split(" ")[0]}
                  <Plus size={11} />
                </Link>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
