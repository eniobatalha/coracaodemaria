"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { BookOpen, CalendarDays, ClipboardList, MessageCircle } from "lucide-react"
import {
  TEACHER_CLASSES,
  getStudentsByTurma,
  loadAttendance,
  loadGrades,
  loadChat,
} from "@/lib/portal-funcionario/mock-data"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function gradeLabel(v: unknown) {
  if (v === null || v === undefined) return "—"
  return String(v)
}

export default function TurmaPage() {
  const { turmaId } = useParams<{ turmaId: string }>()
  const turma    = TEACHER_CLASSES.find((t) => t.id === turmaId)
  const students = getStudentsByTurma(turmaId)

  if (!turma) {
    return (
      <div className="p-8 text-center text-slate-500">Turma não encontrada.</div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">{turma.label}</h1>
          <p className="text-sm text-slate-500">Unidade Gaibu · Fundamental I · {students.length} alunos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/portal-funcionario/painel/turma/${turmaId}/notas`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#071D5B] px-4 py-2.5 text-sm font-black text-white hover:bg-[#0a2a80]">
            <BookOpen size={16} />
            Lançar Notas
          </Link>
          <Link href={`/portal-funcionario/painel/turma/${turmaId}/frequencia`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
            <CalendarDays size={16} />
            Fazer Chamada
          </Link>
        </div>
      </div>

      {/* Student list */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => {
          const attendance = loadAttendance(student.id)
          const grades     = loadGrades(student.id)
          const chatMsgs   = loadChat(student.id)
          const totalFaltas = attendance.reduce((sum, m) => sum + m.absences, 0)
          const unread      = chatMsgs.filter((m) => m.from === "guardian" && !m.read).length
          const lastGrade   = grades[0]
          const accentColor = student.gender === "M" ? "#0057D9" : "#E4252A"

          return (
            <div key={student.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">

              {/* Student header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}>
                  {getInitials(student.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black text-[#071D5B]">{student.name}</p>
                  <p className="text-xs text-slate-500">Mat. {student.matricula?.padStart(6, "0")}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="mb-3 flex gap-3 text-center">
                <div className="flex-1 rounded-xl bg-[#FFF5F5] py-2">
                  <p className="text-lg font-black text-[#C71F2D]">{totalFaltas}</p>
                  <p className="text-[10px] font-bold text-slate-500">Faltas</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#F0F4FF] py-2">
                  <p className="text-lg font-black text-[#071D5B]">
                    {lastGrade ? gradeLabel(lastGrade.b3 ?? lastGrade.b2 ?? lastGrade.b1) : "—"}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500">Último conceito</p>
                </div>
                <div className="flex-1 rounded-xl bg-[#FFF5F5] py-2">
                  <p className="text-lg font-black text-[#C71F2D]">{unread}</p>
                  <p className="text-[10px] font-bold text-slate-500">Msg nova{unread !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Link href={`/portal-funcionario/painel/aluno/${student.id}/agenda`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F0F4FF] px-2.5 py-1.5 text-xs font-black text-[#071D5B] hover:bg-[#E0E8FF]">
                  <ClipboardList size={13} />
                  Agenda
                </Link>
                <Link href={`/portal-funcionario/painel/chat/${student.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
                    unread > 0
                      ? "bg-[#C71F2D] text-white hover:bg-[#a81826]"
                      : "bg-[#FFF0F0] text-[#C71F2D] hover:bg-[#FFE0E0]"
                  }`}>
                  <MessageCircle size={13} />
                  Chat{unread > 0 ? ` (${unread})` : ""}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
