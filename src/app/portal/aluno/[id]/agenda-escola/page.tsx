"use client"

import { useParams } from "next/navigation"
import { CalendarRange } from "lucide-react"
import { MOCK_SCHOOL_EVENTS } from "@/lib/portal/mock-data"

const categoryColors: Record<string, { bg: string; text: string }> = {
  Reunião:  { bg: "bg-[#0057D9]/10", text: "text-[#0057D9]" },
  Evento:   { bg: "bg-[#FF7A1C]/10", text: "text-[#FF7A1C]" },
  Prova:    { bg: "bg-[#E4252A]/10", text: "text-[#E4252A]" },
  Entrega:  { bg: "bg-purple-100",   text: "text-purple-600" },
  Feriado:  { bg: "bg-green-100",    text: "text-green-600"  },
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-")
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
  return { day: d, month: months[parseInt(m) - 1] }
}

export default function AgendaEscolaPage() {
  const params = useParams()
  const studentId = params.id as string

  const today = new Date()
  const upcoming = MOCK_SCHOOL_EVENTS.filter(
    (e) => new Date(e.date + "T00:00:00") >= today
  )
  const past = MOCK_SCHOOL_EVENTS.filter(
    (e) => new Date(e.date + "T00:00:00") < today
  )

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7A1C]/10 text-[#FF7A1C]">
          <CalendarRange size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Agenda da Escola</h1>
          <p className="text-sm text-slate-500">Eventos, provas e prazos</p>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-[#E4252A]">
            Próximos
          </h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => {
              const { day, month } = formatDate(event.date)
              const colors = categoryColors[event.category] ?? { bg: "bg-slate-100", text: "text-slate-600" }
              return (
                <div
                  key={event.id}
                  className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#071D5B] py-2 text-white">
                    <span className="text-xl font-black leading-none">{day}</span>
                    <span className="text-xs opacity-75">{month}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${colors.bg} ${colors.text}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-black text-[#071D5B]">{event.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">{event.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">
            Realizados
          </h2>
          <div className="flex flex-col gap-3">
            {past.map((event) => {
              const { day, month } = formatDate(event.date)
              const colors = categoryColors[event.category] ?? { bg: "bg-slate-100", text: "text-slate-600" }
              return (
                <div
                  key={event.id}
                  className="flex gap-3 rounded-2xl bg-white/60 p-4"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-200 py-2 text-slate-500">
                    <span className="text-xl font-black leading-none">{day}</span>
                    <span className="text-xs opacity-75">{month}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${colors.bg} ${colors.text} opacity-70`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-500">{event.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-400">{event.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
