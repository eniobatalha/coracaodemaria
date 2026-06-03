"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Send } from "lucide-react"
import {
  getTurmaByStudentId,
  getGuardianForStudent,
  loadChat,
  saveChat,
} from "@/lib/portal-funcionario/mock-data"
import { MOCK_STUDENTS } from "@/lib/portal/mock-data"
import type { ChatMessage } from "@/lib/portal/types"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  })
}

export default function ChatConversationPage() {
  const { alunoId } = useParams<{ alunoId: string }>()
  const student  = MOCK_STUDENTS.find((s) => s.id === alunoId)
  const turma    = getTurmaByStudentId(alunoId)
  const guardian = getGuardianForStudent(alunoId)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text,     setText]     = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const msgs = loadChat(alunoId)
    // Mark guardian messages as read when teacher opens the conversation
    const updated = msgs.map((m) => m.from === "guardian" ? { ...m, read: true } : m)
    setMessages(updated)
    saveChat(alunoId, updated)
  }, [alunoId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Aluno não encontrado.</div>
  }

  const accentColor = student.gender === "M" ? "#0057D9" : "#E4252A"

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    const now = new Date()
    const newMsg: ChatMessage = {
      id:   `cm_${Date.now()}`,
      from: "teacher",
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      read: false,
      text: text.trim(),
    }

    const updated = [...messages, newMsg]
    setMessages(updated)
    saveChat(alunoId, updated)
    setText("")
  }

  // Group messages by date
  const grouped = messages.reduce<{ date: string; msgs: ChatMessage[] }[]>((acc, msg) => {
    const last = acc[acc.length - 1]
    if (last && last.date === msg.date) {
      last.msgs.push(msg)
    } else {
      acc.push({ date: msg.date, msgs: [msg] })
    }
    return acc
  }, [])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:h-screen">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shadow-sm md:px-6">
        <Link href="/portal-funcionario/painel/chat"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
          <ChevronLeft size={20} className="text-[#071D5B]" />
        </Link>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
          style={{ backgroundColor: accentColor }}>
          {getInitials(student.name)}
        </div>
        <div className="min-w-0">
          <p className="font-black text-[#071D5B]">{student.name}</p>
          <p className="truncate text-xs text-slate-500">
            {guardian ? `Responsável: ${guardian.name.split(" ")[0]} ${guardian.name.split(" ").slice(-1)[0]}` : ""}
            {turma ? ` · ${turma.shortLabel}` : ""}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        {grouped.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-slate-400">Nenhuma mensagem ainda.<br />Inicie a conversa abaixo.</p>
          </div>
        ) : (
          grouped.map(({ date, msgs }) => (
            <div key={date}>
              {/* Date separator */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-500">
                  {formatDate(date)}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Messages */}
              {msgs.map((msg) => {
                const isTeacher = msg.from === "teacher"
                return (
                  <div key={msg.id}
                    className={`mb-3 flex ${isTeacher ? "justify-end" : "justify-start"}`}>
                    {!isTeacher && (
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white"
                        style={{ backgroundColor: accentColor }}>
                        {guardian ? getInitials(guardian.name) : "?"}
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isTeacher
                        ? "rounded-tr-sm bg-[#4A0010] text-white"
                        : "rounded-tl-sm bg-white text-[#071D5B] shadow-sm ring-1 ring-slate-200"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`mt-1 text-right text-[10px] ${isTeacher ? "text-white/60" : "text-slate-400"}`}>
                        {msg.time}
                        {isTeacher && (
                          <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <form onSubmit={handleSend}
        className="shrink-0 flex gap-2 border-t border-slate-100 bg-white px-4 py-3 md:px-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
          placeholder="Escreva uma mensagem..."
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-[#FFF5F5] px-4 py-3 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20"
        />
        <button type="submit" disabled={!text.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C71F2D] text-white shadow-sm transition hover:bg-[#a81826] disabled:opacity-40">
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
