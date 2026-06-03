"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BookOpen, CalendarDays, MessageCircle, Users } from "lucide-react"
import {
  TEACHER_CLASSES,
  getStudentsByTurma,
  loadChat,
  loadAttendance,
  getAllTeacherStudents,
} from "@/lib/portal-funcionario/mock-data"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

export default function PainelDashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const allStudents = getAllTeacherStudents()
  const totalAlunos = allStudents.length

  let unreadChat = 0
  for (const s of allStudents) {
    unreadChat += loadChat(s.id).filter((m) => m.from === "guardian" && !m.read).length
  }

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Painel da Professora</h1>
        <p className="mt-1 text-sm capitalize text-slate-500">{today}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
          <Users size={20} className="mb-2 text-[#C71F2D]" />
          <p className="text-2xl font-black text-[#071D5B]">{totalAlunos}</p>
          <p className="text-xs font-bold text-slate-500">Alunos</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
          <Users size={20} className="mb-2 text-[#C71F2D]" />
          <p className="text-2xl font-black text-[#071D5B]">{TEACHER_CLASSES.length}</p>
          <p className="text-xs font-bold text-slate-500">Turmas</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10 sm:col-span-1">
          <MessageCircle size={20} className="mb-2 text-[#C71F2D]" />
          <p className="text-2xl font-black text-[#071D5B]">{unreadChat}</p>
          <p className="text-xs font-bold text-slate-500">Mensagens não lidas</p>
        </div>
      </div>

      {/* Classes */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Minhas Turmas</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {TEACHER_CLASSES.map((turma) => {
          const students = getStudentsByTurma(turma.id)
          let totalAbsences = 0
          for (const s of students) {
            const att = loadAttendance(s.id)
            totalAbsences += att.reduce((sum, m) => sum + m.absences, 0)
          }

          return (
            <div key={turma.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-black text-[#071D5B]">{turma.label}</h3>
                  <p className="text-xs text-slate-500">Unidade Gaibu · F1</p>
                </div>
                <span className="rounded-full bg-[#FFF0F0] px-3 py-1 text-xs font-black text-[#C71F2D]">
                  {students.length} alunos
                </span>
              </div>

              {/* Student avatars */}
              <div className="mb-4 flex -space-x-2">
                {students.map((s) => (
                  <div key={s.id}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm"
                    style={{ backgroundColor: s.gender === "M" ? "#0057D9" : "#E4252A" }}>
                    {getInitials(s.name)}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/portal-funcionario/painel/turma/${turma.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#071D5B] px-3 py-2 text-xs font-black text-white hover:bg-[#0a2a80]">
                  <Users size={14} />
                  Ver alunos
                </Link>
                <Link href={`/portal-funcionario/painel/turma/${turma.id}/notas`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F0] px-3 py-2 text-xs font-black text-[#C71F2D] hover:bg-[#FFE0E0]">
                  <BookOpen size={14} />
                  Notas
                </Link>
                <Link href={`/portal-funcionario/painel/turma/${turma.id}/frequencia`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F0] px-3 py-2 text-xs font-black text-[#C71F2D] hover:bg-[#FFE0E0]">
                  <CalendarDays size={14} />
                  Chamada
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chat shortcut */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Mensagens Recentes</h2>
      {unreadChat > 0 ? (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
          {allStudents
            .filter((s) => loadChat(s.id).some((m) => m.from === "guardian" && !m.read))
            .map((s) => {
              const msgs = loadChat(s.id)
              const unread = msgs.filter((m) => m.from === "guardian" && !m.read)
              const last = msgs.findLast((m) => m.from === "guardian")
              return (
                <div key={s.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 border-b border-slate-100 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: s.gender === "M" ? "#0057D9" : "#E4252A" }}>
                    {getInitials(s.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#071D5B]">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">{last?.text}</p>
                  </div>
                  <Link href={`/portal-funcionario/painel/chat/${s.id}`}
                    className="shrink-0 rounded-full bg-[#C71F2D] px-3 py-1 text-xs font-black text-white">
                    {unread.length} nova{unread.length > 1 ? "s" : ""}
                  </Link>
                </div>
              )
            })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
          <MessageCircle size={28} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold text-slate-400">Nenhuma mensagem não lida</p>
        </div>
      )}

      <Link href="/portal-funcionario/painel/chat"
        className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-[#C71F2D] px-4 py-2.5 text-sm font-black text-[#C71F2D] hover:bg-[#C71F2D] hover:text-white transition">
        <MessageCircle size={16} />
        Ver todas as conversas
      </Link>
    </div>
  )
}
