"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Bell, ChevronDown, ChevronUp } from "lucide-react"
import { MOCK_STUDENTS, MOCK_NOTICES } from "@/lib/portal/mock-data"
import type { Notice } from "@/lib/portal/types"

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(!notice.read)

  return (
    <article
      className={`rounded-2xl shadow-sm transition ${
        notice.read ? "bg-white/70" : "bg-white"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div
          className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
            notice.read ? "bg-transparent" : "bg-[#E4252A]"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {notice.urgent && (
              <span className="rounded-full bg-[#E4252A]/10 px-2 py-0.5 text-xs font-black text-[#E4252A]">
                ⚠️ Urgente
              </span>
            )}
            <h3
              className={`text-sm font-black ${
                notice.read ? "text-slate-500" : "text-[#071D5B]"
              }`}
            >
              {notice.title}
            </h3>
          </div>
          <time className="mt-0.5 block text-xs text-slate-400">
            {formatDate(notice.date)}
          </time>
        </div>
        <span className="shrink-0 text-slate-400 mt-0.5">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="text-sm leading-6 text-slate-700">{notice.content}</p>
        </div>
      )}
    </article>
  )
}

export default function AvisosPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  const notices = MOCK_NOTICES[studentId] ?? []

  if (!student) return null

  const unread = notices.filter((n) => !n.read)
  const read = notices.filter((n) => n.read)

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4252A]/10 text-[#E4252A]">
          <Bell size={22} />
          {unread.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E4252A] text-xs font-black text-white">
              {unread.length}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Avisos</h1>
          <p className="text-sm text-slate-500">
            {unread.length > 0
              ? `${unread.length} não lido${unread.length > 1 ? "s" : ""}`
              : "Tudo em dia"}
          </p>
        </div>
      </div>

      {unread.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-[#E4252A]">
            Não lidos
          </h2>
          <div className="flex flex-col gap-2">
            {unread.map((n) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </section>
      )}

      {read.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">
            Lidos
          </h2>
          <div className="flex flex-col gap-2">
            {read.map((n) => <NoticeCard key={n.id} notice={n} />)}
          </div>
        </section>
      )}

      {notices.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <Bell size={40} />
          <p className="font-bold">Nenhum aviso disponível</p>
        </div>
      )}
    </div>
  )
}
