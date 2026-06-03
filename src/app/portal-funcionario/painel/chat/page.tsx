"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import {
  TEACHER_CLASSES,
  getAllTeacherStudents,
  loadChat,
} from "@/lib/portal-funcionario/mock-data"
import type { Student } from "@/lib/portal/types"
import type { ChatMessage } from "@/lib/portal/types"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function formatTime(date: string, time: string) {
  const today = new Date().toISOString().slice(0, 10)
  return date === today ? time : new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

type ConvEntry = {
  student: Student
  messages: ChatMessage[]
  unread: number
  lastMsg: ChatMessage | undefined
  turmaLabel: string
}

export default function ChatListPage() {
  const [convs, setConvs] = useState<ConvEntry[]>([])

  useEffect(() => {
    const students = getAllTeacherStudents()
    const entries: ConvEntry[] = students.map((s) => {
      const messages = loadChat(s.id)
      const unread   = messages.filter((m) => m.from === "guardian" && !m.read).length
      const lastMsg  = messages.length > 0 ? messages[messages.length - 1] : undefined
      const turma    = TEACHER_CLASSES.find((t) => t.studentIds.includes(s.id))
      return { student: s, messages, unread, lastMsg, turmaLabel: turma?.shortLabel ?? "" }
    })
    // Sort: unread first, then by most recent message date
    entries.sort((a, b) => {
      if (b.unread !== a.unread) return b.unread - a.unread
      const dateA = a.lastMsg ? `${a.lastMsg.date} ${a.lastMsg.time}` : ""
      const dateB = b.lastMsg ? `${b.lastMsg.date} ${b.lastMsg.time}` : ""
      return dateB.localeCompare(dateA)
    })
    setConvs(entries)
  }, [])

  const totalUnread = convs.reduce((s, c) => s + c.unread, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Chat</h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalUnread > 0
            ? `${totalUnread} mensagem${totalUnread > 1 ? "ns" : ""} não lida${totalUnread > 1 ? "s" : ""} de responsáveis`
            : "Todas as mensagens estão em dia"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {convs.map(({ student, messages, unread, lastMsg, turmaLabel }) => {
          const accentColor = student.gender === "M" ? "#0057D9" : "#E4252A"
          const hasMessages = messages.length > 0

          return (
            <Link key={student.id}
              href={`/portal-funcionario/painel/chat/${student.id}`}
              className={`flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:shadow-md ${
                unread > 0 ? "ring-[#C71F2D]/30" : "ring-[#C71F2D]/10"
              }`}>
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}>
                  {getInitials(student.name)}
                </div>
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C71F2D] text-[10px] font-black text-white">
                    {unread}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={`truncate text-sm font-black ${unread > 0 ? "text-[#071D5B]" : "text-slate-700"}`}>
                    {student.name}
                  </p>
                  {lastMsg && (
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatTime(lastMsg.date, lastMsg.time)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{turmaLabel}</p>
                {lastMsg ? (
                  <p className={`mt-0.5 truncate text-xs ${unread > 0 ? "font-bold text-slate-600" : "text-slate-400"}`}>
                    {lastMsg.from === "teacher" ? "Você: " : ""}{lastMsg.text}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs italic text-slate-300">Sem mensagens ainda</p>
                )}
              </div>

              {!hasMessages && (
                <MessageCircle size={18} className="shrink-0 text-slate-300" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
