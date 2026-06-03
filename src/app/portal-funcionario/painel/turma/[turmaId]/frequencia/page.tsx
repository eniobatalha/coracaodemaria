"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, Save, Check, CalendarCheck2 } from "lucide-react"
import { TEACHER_CLASSES, getStudentsByTurma, loadAttendance, saveAttendance } from "@/lib/portal-funcionario/mock-data"
import type { AttendanceMonth } from "@/lib/portal/types"
import type { Student } from "@/lib/portal/types"

type AttendanceMap = Record<string, AttendanceMonth[]>

const MONTHS = ["Fev", "Mar", "Abr", "Mai", "Jun"] as const

// Chamada do dia — per-student status for today's roll call
type DayStatus = "P" | "F" | "FJ"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

export default function FrequenciaPage() {
  const { turmaId } = useParams<{ turmaId: string }>()
  const turma    = TEACHER_CLASSES.find((t) => t.id === turmaId)
  const students = getStudentsByTurma(turmaId)

  const [tab,        setTab]        = useState<"chamada" | "historico">("chamada")
  const [attendance, setAttendance] = useState<AttendanceMap>({})
  const [dayStatus,  setDayStatus]  = useState<Record<string, DayStatus>>({})
  const [savedHist,  setSavedHist]  = useState(false)
  const [savedDay,   setSavedDay]   = useState(false)

  useEffect(() => {
    const initial: AttendanceMap = {}
    const defaultDay: Record<string, DayStatus> = {}
    for (const s of students) {
      initial[s.id]    = loadAttendance(s.id)
      defaultDay[s.id] = "P"
    }
    setAttendance(initial)
    setDayStatus(defaultDay)
  }, [turmaId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!turma || students.length === 0) {
    return <div className="p-8 text-center text-slate-500">Turma não encontrada.</div>
  }

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  function handleMonthChange(studentId: string, month: string, field: "absences" | "justifiedAbsences", value: number) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId].map((m) =>
        m.month === month ? { ...m, [field]: Math.max(0, value) } : m
      ),
    }))
    setSavedHist(false)
  }

  function handleSaveHistory() {
    for (const s of students) {
      if (attendance[s.id]) saveAttendance(s.id, attendance[s.id])
    }
    setSavedHist(true)
    setTimeout(() => setSavedHist(false), 3000)
  }

  function handleSaveChamada() {
    // Increment June absences based on today's roll call
    setAttendance((prev) => {
      const updated = { ...prev }
      for (const s of students) {
        const status = dayStatus[s.id] ?? "P"
        if (status !== "P") {
          const months = prev[s.id].map((m) =>
            m.month === "Jun"
              ? {
                  ...m,
                  absences:         m.absences         + (status === "F"  ? 1 : 0),
                  justifiedAbsences: m.justifiedAbsences + (status === "FJ" ? 1 : 0),
                }
              : m
          )
          updated[s.id] = months
          saveAttendance(s.id, months)
        }
      }
      return updated
    })
    setSavedDay(true)
    setTimeout(() => setSavedDay(false), 3000)
  }

  function presencaRate(studentId: string) {
    const months = attendance[studentId] ?? []
    const total   = months.reduce((s, m) => s + m.workingDays, 0)
    const faltas  = months.reduce((s, m) => s + m.absences, 0)
    if (total === 0) return 100
    return Math.round(((total - faltas) / total) * 100)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href={`/portal-funcionario/painel/turma/${turmaId}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-100">
          <ChevronLeft size={20} className="text-[#071D5B]" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Frequência — {turma.label}</h1>
          <p className="text-xs text-slate-500">Chamada diária e histórico de faltas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {(["chamada", "historico"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              tab === t
                ? "bg-[#4A0010] text-white shadow-sm"
                : "bg-white text-[#071D5B] hover:bg-slate-100"
            }`}>
            {t === "chamada" ? "Chamada de Hoje" : "Histórico Mensal"}
          </button>
        ))}
      </div>

      {/* CHAMADA DO DIA */}
      {tab === "chamada" && (
        <div>
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#FFF0F0] px-4 py-3">
            <CalendarCheck2 size={18} className="text-[#C71F2D]" />
            <p className="text-sm font-bold capitalize text-[#4A0010]">{today}</p>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-[#C71F2D]/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500">Aluno</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-green-600">Presente</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-red-600">Falta</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-amber-600">Justificada</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => {
                  const status = dayStatus[s.id] ?? "P"
                  const accentColor = s.gender === "M" ? "#0057D9" : "#E4252A"
                  return (
                    <tr key={s.id} className={`border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                            style={{ backgroundColor: accentColor }}>
                            {getInitials(s.name)}
                          </div>
                          <span className="font-bold text-[#071D5B]">{s.name.split(" ")[0]}</span>
                        </div>
                      </td>
                      {(["P", "F", "FJ"] as DayStatus[]).map((opt) => (
                        <td key={opt} className="px-4 py-3 text-center">
                          <button
                            onClick={() => setDayStatus((prev) => ({ ...prev, [s.id]: opt }))}
                            className={`h-9 w-9 rounded-full text-sm font-black transition ${
                              status === opt
                                ? opt === "P"
                                  ? "bg-green-500 text-white shadow-sm"
                                  : opt === "F"
                                    ? "bg-red-500 text-white shadow-sm"
                                    : "bg-amber-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}>
                            {opt}
                          </button>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={handleSaveChamada}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black transition ${
                savedDay ? "bg-green-600 text-white" : "bg-[#C71F2D] text-white hover:bg-[#a81826]"
              }`}>
              {savedDay ? <><Check size={18} /> Chamada salva!</> : <><Save size={18} /> Salvar Chamada</>}
            </button>
          </div>
          <p className="mt-2 text-right text-xs text-slate-400">
            Faltas e justificadas serão adicionadas ao histórico de Junho
          </p>
        </div>
      )}

      {/* HISTÓRICO MENSAL */}
      {tab === "historico" && (
        <div>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-[#C71F2D]/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500 min-w-36">Aluno</th>
                  {MONTHS.map((m) => (
                    <th key={m} colSpan={2} className="px-2 py-3 text-center text-xs font-black uppercase tracking-wide text-slate-500 min-w-24 border-l border-slate-100">
                      {m}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-black uppercase tracking-wide text-slate-500">%</th>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-4 py-1" />
                  {MONTHS.map((m) => (
                    <React.Fragment key={m}>
                      <th className="px-2 py-1 text-center text-[10px] font-bold text-red-400 border-l border-slate-100">F</th>
                      <th className="px-2 py-1 text-center text-[10px] font-bold text-amber-400">FJ</th>
                    </React.Fragment>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => {
                  const months = attendance[s.id] ?? []
                  const rate   = presencaRate(s.id)
                  return (
                    <tr key={s.id} className={`border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                            style={{ backgroundColor: s.gender === "M" ? "#0057D9" : "#E4252A" }}>
                            {getInitials(s.name)}
                          </div>
                          <span className="font-bold text-[#071D5B]">{s.name.split(" ")[0]}</span>
                        </div>
                      </td>
                      {MONTHS.map((month) => {
                        const data = months.find((m) => m.month === month) ?? { absences: 0, justifiedAbsences: 0 }
                        return (
                          <React.Fragment key={month}>
                            <td className="px-1 py-2 text-center border-l border-slate-100">
                              <input type="number" min={0} max={30} value={data.absences}
                                onChange={(e) => handleMonthChange(s.id, month, "absences", parseInt(e.target.value) || 0)}
                                className="w-10 rounded-lg border border-slate-200 bg-red-50 py-1 text-center text-xs font-bold text-red-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200" />
                            </td>
                            <td className="px-1 py-2 text-center">
                              <input type="number" min={0} max={30} value={data.justifiedAbsences}
                                onChange={(e) => handleMonthChange(s.id, month, "justifiedAbsences", parseInt(e.target.value) || 0)}
                                className="w-10 rounded-lg border border-slate-200 bg-amber-50 py-1 text-center text-xs font-bold text-amber-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                            </td>
                          </React.Fragment>
                        )
                      })}
                      <td className="px-3 py-2 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-black ${
                          rate >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">F = Falta injustificada · FJ = Falta justificada</p>
            <button onClick={handleSaveHistory}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black transition ${
                savedHist ? "bg-green-600 text-white" : "bg-[#C71F2D] text-white hover:bg-[#a81826]"
              }`}>
              {savedHist ? <><Check size={18} /> Salvo!</> : <><Save size={18} /> Salvar Histórico</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
