"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { MessageCircle, Send } from "lucide-react"
import { MOCK_CHAT_MESSAGES, MOCK_GUARDIAN, MOCK_STUDENTS } from "@/lib/portal/mock-data"
import type { ChatMessage } from "@/lib/portal/types"

function formatDateLabel(iso: string) {
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  if (iso === today) return "Hoje"
  if (iso === yesterday) return "Ontem"
  const [y, m, d] = iso.split("-")
  const months = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
  return `${d} de ${months[parseInt(m) - 1]} de ${y}`
}

function groupByDate(msgs: ChatMessage[]): [string, ChatMessage[]][] {
  const map = new Map<string, ChatMessage[]>()
  for (const m of msgs) {
    if (!map.has(m.date)) map.set(m.date, [])
    map.get(m.date)!.push(m)
  }
  return Array.from(map.entries())
}

export default function ChatPage() {
  const params    = useParams()
  const studentId = params.id as string
  const student   = MOCK_STUDENTS.find((s) => s.id === studentId)
  const guardian  = MOCK_GUARDIAN

  const [messages, setMessages] = useState<ChatMessage[]>(
    () => MOCK_CHAT_MESSAGES[studentId] ?? []
  )
  const [input, setInput] = useState("")
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // Scroll to latest message on mount and on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!student) return null

  const isBoy       = student.gender === "M"
  const accentColor = isBoy ? "#0057D9" : "#E4252A"
  const grouped     = groupByDate(messages)

  function getInitials(name: string) {
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
  }

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    const now  = new Date()
    const msg: ChatMessage = {
      id:   `msg-${Date.now()}`,
      from: "guardian",
      text,
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: now.toISOString().split("T")[0],
      read: true,
    }
    setMessages((prev) => [...prev, msg])
    setInput("")
    inputRef.current?.focus()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100svh - 56px)" }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 shadow-sm md:top-0">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
          style={{ backgroundColor: accentColor }}
        >
          {getInitials(student.teacher)}
        </div>
        <div>
          <p className="text-sm font-black text-[#071D5B]">{student.teacher}</p>
          <p className="text-xs text-slate-400">
            {student.grade} {student.class} — Unidade {student.unit}
          </p>
        </div>
        <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#EAFBFF] text-[#0057D9]">
          <MessageCircle size={16} />
        </div>
      </div>

      {/* ── Notice ── */}
      <div className="bg-[#EAFBFF] px-4 py-2 text-center text-xs text-[#071D5B]/60">
        Mensagens são respondidas em horário escolar. Não substitui comunicação urgente.
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto bg-[#F0F4FF] px-4 py-4 pb-28 md:pb-20">
        {grouped.map(([date, msgs]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-400 shadow-sm">
                {formatDateLabel(date)}
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Messages for this date */}
            {msgs.map((msg) => {
              const isMe = msg.from === "guardian"
              return (
                <div
                  key={msg.id}
                  className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {/* Teacher avatar */}
                  {!isMe && (
                    <div
                      className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center self-end rounded-full text-[10px] font-black text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {getInitials(student.teacher)}
                    </div>
                  )}

                  <div className={`max-w-[75%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        isMe
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm bg-white text-[#071D5B]"
                      }`}
                      style={isMe ? { backgroundColor: accentColor } : {}}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>

                    {/* Timestamp + read receipt */}
                    <div className={`mt-1 flex items-center gap-1 ${isMe ? "flex-row-reverse" : ""}`}>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                      {isMe && (
                        <span className={`text-[10px] font-bold ${msg.read ? "text-[#0057D9]" : "text-slate-300"}`}>
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar — fixed above bottom nav ── */}
      <div className="fixed bottom-16 left-0 right-0 z-20 border-t border-slate-100 bg-white px-3 py-2.5 shadow-lg md:bottom-0 md:left-64 lg:left-72">
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-2xl bg-[#F0F4FF] px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escreva uma mensagem..."
              className="w-full bg-transparent text-sm text-[#071D5B] placeholder-slate-400 outline-none"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md transition disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
