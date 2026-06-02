"use client"

import { useParams } from "next/navigation"
import { BookOpen } from "lucide-react"
import { MOCK_STUDENTS, MOCK_GRADES } from "@/lib/portal/mock-data"
import type { GradeValue } from "@/lib/portal/types"

function gradeColor(val: GradeValue): string {
  if (val === null) return "text-slate-300"
  if (typeof val === "number") {
    if (val >= 7) return "text-green-600"
    if (val >= 5) return "text-amber-500"
    return "text-[#E4252A]"
  }
  if (val === "MB") return "text-green-600"
  if (val === "B") return "text-amber-500"
  return "text-[#E4252A]"
}

function GradeCell({ value }: { value: GradeValue }) {
  if (value === null)
    return <span className="text-slate-300 text-sm">—</span>
  return (
    <span className={`font-black text-sm ${gradeColor(value)}`}>
      {typeof value === "number" ? value.toFixed(1) : value}
    </span>
  )
}

export default function BoletimPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const grades = MOCK_GRADES[studentId] ?? []

  if (!student) return null

  const isNumeric = typeof grades[0]?.b1 === "number" || grades[0]?.b1 === null

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0057D9]/10 text-[#0057D9]">
          <BookOpen size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Boletim</h1>
          <p className="text-sm text-slate-500">Ano letivo 2026 · {student.grade} {student.class} — {student.etapa}</p>
        </div>
      </div>

      {/* Legend for infantil */}
      {!isNumeric && (
        <div className="mb-4 flex flex-wrap gap-3 rounded-2xl bg-white p-3 shadow-sm text-xs font-bold">
          <span className="text-green-600">MB = Muito Bom</span>
          <span className="text-amber-500">B = Bom</span>
          <span className="text-[#E4252A]">R = Regular</span>
          <span className="text-slate-400">— = Aguardando</span>
        </div>
      )}

      {/* Mobile: cards per subject */}
      <div className="flex flex-col gap-3 md:hidden">
        {grades.map((g) => (
          <div key={g.subject} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-black text-[#071D5B] text-sm">{g.subject}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  g.status === "Em curso"
                    ? "bg-blue-50 text-[#0057D9]"
                    : g.status === "Aprovado"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-[#E4252A]"
                }`}
              >
                {g.status}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(["b1", "b2", "b3", "b4"] as const).map((bim, i) => (
                <div key={bim}>
                  <p className="text-xs text-slate-400">{i + 1}º Bim</p>
                  <GradeCell value={g[bim]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="bg-[#F0F4FF]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide text-[#071D5B]">
                Disciplina
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#071D5B]">
                1º Bim
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#071D5B]">
                2º Bim
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#071D5B]">
                3º Bim
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#071D5B]">
                4º Bim
              </th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wide text-[#071D5B]">
                Situação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.map((g) => (
              <tr key={g.subject} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-[#071D5B]">
                  {g.subject}
                </td>
                {(["b1", "b2", "b3", "b4"] as const).map((bim) => (
                  <td key={bim} className="px-4 py-3 text-center">
                    <GradeCell value={g[bim]} />
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      g.status === "Em curso"
                        ? "bg-blue-50 text-[#0057D9]"
                        : g.status === "Aprovado"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-[#E4252A]"
                    }`}
                  >
                    {g.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Dados atualizados pela coordenação pedagógica
      </p>
    </div>
  )
}
