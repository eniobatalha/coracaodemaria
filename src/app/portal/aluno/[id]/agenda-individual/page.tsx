"use client"

import { useParams } from "next/navigation"
import { ClipboardList } from "lucide-react"
import { MOCK_STUDENTS, MOCK_AGENDA_ENTRIES } from "@/lib/portal/mock-data"

const categoryStyle: Record<string, { emoji: string; bg: string; text: string }> = {
  "Comportamento": { emoji: "⚠️", bg: "bg-amber-50",  text: "text-amber-700"  },
  "Dever de casa": { emoji: "📚", bg: "bg-[#0057D9]/10", text: "text-[#0057D9]" },
  "Participação":  { emoji: "🙋", bg: "bg-green-50",  text: "text-green-700"  },
  "Elogio":        { emoji: "⭐", bg: "bg-yellow-50", text: "text-yellow-700" },
  "Observação":    { emoji: "📝", bg: "bg-slate-100", text: "text-slate-600"  },
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

export default function AgendaIndividualPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const entries = MOCK_AGENDA_ENTRIES[studentId] ?? []

  if (!student) return null

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <ClipboardList size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Agenda Individual</h1>
          <p className="text-sm text-slate-500">
            Anotações de {student.teacher}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(categoryStyle).map(([cat, style]) => (
          <span
            key={cat}
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${style.bg} ${style.text}`}
          >
            {style.emoji} {cat}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => {
          const style = categoryStyle[entry.category] ?? categoryStyle["Observação"]
          return (
            <article key={entry.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text}`}>
                  {style.emoji} {entry.category}
                </span>
                <time className="text-xs text-slate-400">{formatDate(entry.date)}</time>
              </div>
              <h3 className="font-black text-[#071D5B]">{entry.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{entry.description}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
