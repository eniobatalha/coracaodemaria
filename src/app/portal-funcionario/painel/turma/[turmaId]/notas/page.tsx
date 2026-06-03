"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronLeft, Save, Check } from "lucide-react"
import { TEACHER_CLASSES, getStudentsByTurma, loadGrades, saveGrades } from "@/lib/portal-funcionario/mock-data"
import type { SubjectGrade } from "@/lib/portal/types"
import type { Student } from "@/lib/portal/types"

type GradeMap = Record<string, SubjectGrade[]> // studentId → grades

const BIMESTRES = ["B1", "B2", "B3", "B4"] as const
type Bim = "B1" | "B2" | "B3" | "B4"
const BIM_KEY: Record<Bim, keyof SubjectGrade> = { B1: "b1", B2: "b2", B3: "b3", B4: "b4" }

const GRADE_OPTIONS = ["", "MB", "B", "R"] as const
const GRADE_COLORS: Record<string, string> = {
  MB: "text-green-700 bg-green-50",
  B:  "text-blue-700 bg-blue-50",
  R:  "text-amber-700 bg-amber-50",
  "": "text-slate-400 bg-slate-50",
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

export default function NotasPage() {
  const { turmaId } = useParams<{ turmaId: string }>()
  const turma    = TEACHER_CLASSES.find((t) => t.id === turmaId)
  const students = getStudentsByTurma(turmaId)

  const [bim,    setBim]    = useState<Bim>("B3")
  const [grades, setGrades] = useState<GradeMap>({})
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    const initial: GradeMap = {}
    for (const s of students) initial[s.id] = loadGrades(s.id)
    setGrades(initial)
  }, [turmaId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!turma || students.length === 0) {
    return <div className="p-8 text-center text-slate-500">Turma não encontrada.</div>
  }

  const subjects = grades[students[0]?.id]?.map((g) => g.subject) ?? []
  const bimKey   = BIM_KEY[bim]

  function handleChange(studentId: string, subjectIdx: number, value: string) {
    setGrades((prev) => {
      const copy = prev[studentId].map((g, i) =>
        i === subjectIdx ? { ...g, [bimKey]: value === "" ? null : value } : g
      )
      return { ...prev, [studentId]: copy }
    })
    setSaved(false)
  }

  function handleSave() {
    for (const s of students) {
      if (grades[s.id]) saveGrades(s.id, grades[s.id])
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
          <h1 className="text-xl font-black text-[#071D5B]">Notas — {turma.label}</h1>
          <p className="text-xs text-slate-500">Conceitos: MB = Muito Bom · B = Bom · R = Regular</p>
        </div>
      </div>

      {/* Bimestre tabs */}
      <div className="mb-5 flex gap-2">
        {BIMESTRES.map((b) => (
          <button key={b} onClick={() => setBim(b)}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              bim === b
                ? "bg-[#4A0010] text-white shadow-sm"
                : "bg-white text-[#071D5B] hover:bg-slate-100"
            }`}>
            {b}
          </button>
        ))}
        <div className="ml-auto">
          <button onClick={handleSave}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
              saved
                ? "bg-green-600 text-white"
                : "bg-[#C71F2D] text-white hover:bg-[#a81826]"
            }`}>
            {saved ? <><Check size={16} /> Salvo!</> : <><Save size={16} /> Salvar</>}
          </button>
        </div>
      </div>

      {/* Grades table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-[#C71F2D]/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500 min-w-36">
                Aluno
              </th>
              {subjects.map((sub) => (
                <th key={sub} className="px-3 py-3 text-center text-xs font-black uppercase tracking-wide text-slate-500 min-w-28">
                  {sub}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, sIdx) => {
              const studentGrades = grades[student.id] ?? []
              return (
                <tr key={student.id}
                  className={`border-b border-slate-100 last:border-0 ${sIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: student.gender === "M" ? "#0057D9" : "#E4252A" }}>
                        {getInitials(student.name)}
                      </div>
                      <span className="font-bold text-[#071D5B] leading-tight">
                        {student.name.split(" ")[0]}{" "}
                        <span className="hidden sm:inline">{student.name.split(" ").slice(1).join(" ")}</span>
                      </span>
                    </div>
                  </td>
                  {studentGrades.map((grade, gIdx) => {
                    const val = grade[bimKey] as string | null
                    return (
                      <td key={grade.subject} className="px-3 py-3 text-center">
                        <select
                          value={val ?? ""}
                          onChange={(e) => handleChange(student.id, gIdx, e.target.value)}
                          className={`w-full cursor-pointer rounded-lg border-0 py-1.5 text-center text-sm font-black outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-[#C71F2D] ${
                            GRADE_COLORS[val ?? ""]
                          }`}>
                          <option value="">—</option>
                          <option value="MB">MB</option>
                          <option value="B">B</option>
                          <option value="R">R</option>
                        </select>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-black transition ${
            saved
              ? "bg-green-600 text-white"
              : "bg-[#C71F2D] text-white hover:bg-[#a81826]"
          }`}>
          {saved ? <><Check size={18} /> Notas salvas!</> : <><Save size={18} /> Salvar Notas</>}
        </button>
      </div>
    </div>
  )
}
