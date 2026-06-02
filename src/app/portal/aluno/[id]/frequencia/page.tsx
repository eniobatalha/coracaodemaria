"use client"

import { useParams } from "next/navigation"
import { CalendarDays } from "lucide-react"
import { MOCK_STUDENTS, MOCK_ATTENDANCE } from "@/lib/portal/mock-data"

export default function FrequenciaPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const months = MOCK_ATTENDANCE[studentId] ?? []

  if (!student) return null

  const totalDays = months.reduce((s, m) => s + m.workingDays, 0)
  const totalAbsences = months.reduce((s, m) => s + m.absences, 0)
  const totalJustified = months.reduce((s, m) => s + m.justifiedAbsences, 0)
  const totalPresences = totalDays - totalAbsences
  const pct = totalDays > 0 ? Math.round((totalPresences / totalDays) * 100) : 100

  const pctColor =
    pct >= 85 ? "text-green-600" : pct >= 75 ? "text-amber-500" : "text-[#E4252A]"
  const barColor =
    pct >= 85 ? "#22c55e" : pct >= 75 ? "#f59e0b" : "#E4252A"

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
          <CalendarDays size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Frequência</h1>
          <p className="text-sm text-slate-500">Ano letivo 2026 · {student.grade} {student.class} — {student.etapa}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 rounded-2xl bg-white p-4 shadow-sm sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Frequência
          </p>
          <p className={`mt-1 text-4xl font-black ${pctColor}`}>{pct}%</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Dias letivos
          </p>
          <p className="mt-1 text-3xl font-black text-[#071D5B]">{totalDays}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Presenças
          </p>
          <p className="mt-1 text-3xl font-black text-green-600">{totalPresences}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Faltas
          </p>
          <p className="mt-1 text-3xl font-black text-[#E4252A]">{totalAbsences}</p>
          {totalJustified > 0 && (
            <p className="mt-0.5 text-xs text-slate-400">
              {totalJustified} justificada{totalJustified > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-black text-[#071D5B]">
          Por mês
        </h2>
        <div className="flex flex-col gap-3">
          {months.map((m) => {
            const presence = m.workingDays - m.absences
            const monthPct = Math.round((presence / m.workingDays) * 100)
            const mColor =
              monthPct >= 85 ? "#22c55e" : monthPct >= 75 ? "#f59e0b" : "#E4252A"
            return (
              <div key={m.month}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-bold text-[#071D5B]">{m.month}</span>
                  <span className="text-xs text-slate-500">
                    {presence}/{m.workingDays} dias
                    {m.absences > 0 && (
                      <span className="ml-2 text-[#E4252A] font-bold">
                        {m.absences} falta{m.absences > 1 ? "s" : ""}
                        {m.justifiedAbsences > 0 && ` (${m.justifiedAbsences} just.)`}
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${monthPct}%`, backgroundColor: mColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Mínimo de 75% de frequência exigido por lei
      </p>
    </div>
  )
}
