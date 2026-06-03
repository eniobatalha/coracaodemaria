"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BarChart2, Bell, BookOpen, CalendarDays, CalendarRange, GalleryHorizontal, Landmark, MessageCircle, Users } from "lucide-react"
import {
  TEACHER_CLASSES,
  getStudentsByTurma,
  loadChat,
  loadAttendance,
  getAllTeacherStudents,
} from "@/lib/portal-funcionario/mock-data"
import {
  loadSchoolEvents,
  loadBroadcastNotices,
  loadAllBoletos,
  getDebtors,
} from "@/lib/portal-funcionario/secretaria-data"
import {
  CURRENT_MONTH,
  TOTAL_STUDENTS,
  TOTAL_EXPECTED_JUNE,
  DEBTORS,
} from "@/lib/portal-funcionario/diretoria-data"
import { MOCK_STUDENTS } from "@/lib/portal/mock-data"
import type { Employee } from "./layout"

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

// ─── Teacher dashboard ────────────────────────────────────────────────────────
function TeacherDashboard() {
  const allStudents = getAllTeacherStudents()
  const totalAlunos = allStudents.length

  let unreadChat = 0
  for (const s of allStudents) {
    unreadChat += loadChat(s.id).filter((m) => m.from === "guardian" && !m.read).length
  }

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Painel da Professora</h1>
        <p className="mt-1 text-sm capitalize text-slate-500">{today}</p>
      </div>

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
          <p className="text-xs font-bold text-slate-500">Msgs não lidas</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Minhas Turmas</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {TEACHER_CLASSES.map((turma) => {
          const students = getStudentsByTurma(turma.id)
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
                  <Users size={14} /> Ver alunos
                </Link>
                <Link href={`/portal-funcionario/painel/turma/${turma.id}/notas`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F0] px-3 py-2 text-xs font-black text-[#C71F2D] hover:bg-[#FFE0E0]">
                  <BookOpen size={14} /> Notas
                </Link>
                <Link href={`/portal-funcionario/painel/turma/${turma.id}/frequencia`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F0] px-3 py-2 text-xs font-black text-[#C71F2D] hover:bg-[#FFE0E0]">
                  <CalendarDays size={14} /> Chamada
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Mensagens Recentes</h2>
      {unreadChat > 0 ? (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
          {allStudents
            .filter((s) => loadChat(s.id).some((m) => m.from === "guardian" && !m.read))
            .map((s) => {
              const msgs  = loadChat(s.id)
              const unread = msgs.filter((m) => m.from === "guardian" && !m.read)
              const last   = msgs.findLast((m) => m.from === "guardian")
              return (
                <div key={s.id} className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0 last:pb-0 first:pt-0">
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
        className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-[#C71F2D] px-4 py-2.5 text-sm font-black text-[#C71F2D] hover:bg-[#C71F2D] hover:text-white transition">
        <MessageCircle size={16} /> Ver todas as conversas
      </Link>
    </div>
  )
}

// ─── Secretary dashboard ──────────────────────────────────────────────────────
function SecretaryDashboard() {
  const events   = loadSchoolEvents()
  const notices  = loadBroadcastNotices()
  const boletos  = loadAllBoletos()
  const debtors  = getDebtors(boletos)
  const today    = new Date()
  const todayStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })

  const upcomingEvents = events
    .filter((e) => e.date >= today.toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  const EVENT_COLORS: Record<string, string> = {
    Evento: "bg-blue-100 text-blue-700", Reunião: "bg-purple-100 text-purple-700",
    Prova: "bg-red-100 text-red-700", Entrega: "bg-amber-100 text-amber-700",
    Feriado: "bg-slate-100 text-slate-600",
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Painel da Secretaria</h1>
        <p className="mt-1 text-sm capitalize text-slate-500">{todayStr}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Alunos",           value: MOCK_STUDENTS.length, icon: Users,            color: "text-[#C71F2D]" },
          { label: "Eventos ativos",   value: events.length,        icon: CalendarRange,    color: "text-blue-600"  },
          { label: "Comunicados",      value: notices.length,       icon: Bell,             color: "text-amber-600" },
          { label: "Devedores",        value: debtors.length,       icon: Landmark,         color: "text-red-600"   },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
            <Icon size={20} className={`mb-2 ${color}`} />
            <p className="text-2xl font-black text-[#071D5B]">{value}</p>
            <p className="text-xs font-bold text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Ações Rápidas</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Novo Evento",      href: "/portal-funcionario/painel/secretaria/agenda",      icon: CalendarRange,   bg: "bg-blue-600"   },
          { label: "Comunicado",       href: "/portal-funcionario/painel/secretaria/comunicados", icon: Bell,            bg: "bg-amber-600"  },
          { label: "Galeria",          href: "/portal-funcionario/painel/secretaria/galeria",     icon: GalleryHorizontal, bg: "bg-green-600" },
          { label: "Retorno Banco",    href: "/portal-funcionario/painel/secretaria/financeiro",  icon: Landmark,        bg: "bg-red-600"    },
        ].map(({ label, href, icon: Icon, bg }) => (
          <Link key={href} href={href}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl ${bg} px-3 py-5 text-center text-sm font-black text-white shadow-sm hover:opacity-90 transition`}>
            <Icon size={24} />
            {label}
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Próximos Eventos</h2>
      <div className="mb-6 flex flex-col gap-2">
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum evento futuro cadastrado.</p>
        ) : (
          upcomingEvents.map((ev) => (
            <div key={ev.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
              <div className="shrink-0 text-center">
                <p className="text-lg font-black text-[#071D5B] leading-none">
                  {new Date(ev.date + "T00:00:00").getDate().toString().padStart(2, "0")}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  {new Date(ev.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#071D5B]">{ev.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{ev.description}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black ${EVENT_COLORS[ev.category] ?? "bg-slate-100 text-slate-600"}`}>
                {ev.category}
              </span>
            </div>
          ))
        )}
        <Link href="/portal-funcionario/painel/secretaria/agenda"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C71F2D] px-4 py-2 text-sm font-black text-[#C71F2D] hover:bg-[#C71F2D] hover:text-white transition">
          <CalendarRange size={15} /> Gerenciar agenda
        </Link>
      </div>

      {/* Debtors */}
      {debtors.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Devedores Atuais</h2>
          <div className="mb-4 flex flex-col gap-2">
            {debtors.slice(0, 3).map((d) => (
              <div key={d.studentId} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-xs font-black text-[#C71F2D]">
                  {getInitials(d.studentName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#071D5B]">{d.studentName}</p>
                  <p className="text-xs text-slate-500">Mat. {d.matricula.padStart(6, "0")}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#C71F2D]">
                    {d.totalOwed.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  {d.hasOverdue && <p className="text-[10px] font-bold text-red-500">Vencido</p>}
                </div>
              </div>
            ))}
          </div>
          <Link href="/portal-funcionario/painel/secretaria/financeiro"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C71F2D] px-4 py-2 text-sm font-black text-[#C71F2D] hover:bg-[#C71F2D] hover:text-white transition">
            <Landmark size={15} /> Importar retorno bancário
          </Link>
        </>
      )}
    </div>
  )
}

// ─── Director dashboard ───────────────────────────────────────────────────────
function DirectorDashboard() {
  const events    = loadSchoolEvents()
  const notices   = loadBroadcastNotices()
  const today     = new Date()
  const todayStr  = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })

  const TOTAL_STAFF = 28

  const upcomingEvents = events
    .filter((e: { date: string }) => e.date >= today.toISOString().slice(0, 10))
    .sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date))
    .slice(0, 3)

  const recentNotices = [...notices]
    .sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date))
    .slice(0, 2)

  const CAT_COLORS: Record<string, string> = {
    Evento: "bg-blue-100 text-blue-700", Reunião: "bg-purple-100 text-purple-700",
    Prova: "bg-red-100 text-red-700", Entrega: "bg-amber-100 text-amber-700",
    Feriado: "bg-slate-100 text-slate-600",
  }

  const kpis = [
    { label: "Alunos",         value: TOTAL_STUDENTS,                                                         color: "text-[#071D5B]",  sub: "matriculados" },
    { label: "Equipe",         value: TOTAL_STAFF,                                                            color: "text-[#071D5B]",  sub: "funcionários" },
    { label: "Receita Jun.",   value: `R$${(CURRENT_MONTH.receita / 1000).toFixed(1)}k`,                      color: "text-green-600",  sub: "parcial" },
    { label: "A receber",      value: `R$${((TOTAL_EXPECTED_JUNE - CURRENT_MONTH.receita) / 1000).toFixed(1)}k`, color: "text-amber-600", sub: "pendente" },
    { label: "Inadimplentes",  value: DEBTORS.length,                                                         color: "text-[#C71F2D]",  sub: "responsáveis" },
    { label: "Adimplência",    value: `${CURRENT_MONTH.adimplencia}%`,                                        color: "text-blue-600",   sub: "no mês" },
  ]

  const quickLinks = [
    { label: "Dashboard Financeiro", href: "/portal-funcionario/painel/diretoria/financeiro",  bg: "bg-[#4A0010]",   icon: BarChart2 },
    { label: "Agenda Escolar",       href: "/portal-funcionario/painel/secretaria/agenda",     bg: "bg-blue-600",    icon: CalendarRange },
    { label: "Comunicados",          href: "/portal-funcionario/painel/secretaria/comunicados",bg: "bg-amber-600",   icon: Bell },
    { label: "Galeria",              href: "/portal-funcionario/painel/secretaria/galeria",    bg: "bg-green-600",   icon: GalleryHorizontal },
    { label: "Retorno Bancário",     href: "/portal-funcionario/painel/secretaria/financeiro", bg: "bg-[#C71F2D]",   icon: Landmark },
    { label: "Chat Turmas",          href: "/portal-funcionario/painel/chat",                  bg: "bg-[#071D5B]",   icon: MessageCircle },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Painel da Diretoria</h1>
        <p className="mt-1 text-sm capitalize text-slate-500">{todayStr}</p>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {kpis.map(({ label, value, color, sub }) => (
          <div key={label} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#C71F2D]/10 text-center">
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] font-black text-slate-500 leading-none mt-0.5">{label}</p>
            <p className="text-[9px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Acesso Rápido</h2>
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {quickLinks.map(({ label, href, bg, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl ${bg} px-2 py-4 text-center text-xs font-black text-white shadow-sm hover:opacity-90 transition`}>
            <Icon size={20} />
            <span className="leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming events */}
        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Próximos Eventos</h2>
          <div className="flex flex-col gap-2">
            {upcomingEvents.map((ev: { id: string; date: string; title: string; category: string }) => (
              <div key={ev.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#C71F2D]/10">
                <div className="shrink-0 text-center w-10">
                  <p className="text-base font-black text-[#071D5B] leading-none">
                    {new Date(ev.date + "T00:00:00").getDate().toString().padStart(2, "0")}
                  </p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    {new Date(ev.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                  </p>
                </div>
                <p className="flex-1 truncate text-sm font-bold text-[#071D5B]">{ev.title}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${CAT_COLORS[ev.category] ?? "bg-slate-100 text-slate-600"}`}>{ev.category}</span>
              </div>
            ))}
            <Link href="/portal-funcionario/painel/secretaria/agenda"
              className="text-xs font-bold text-[#C71F2D] hover:underline">
              Gerenciar agenda →
            </Link>
          </div>
        </div>

        {/* Recent notices */}
        <div>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Últimos Comunicados</h2>
          <div className="flex flex-col gap-2">
            {recentNotices.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhum comunicado ainda.</p>
            ) : (
              recentNotices.map((n: { id: string; urgent: boolean; title: string; date: string }) => (
                <div key={n.id} className={`rounded-2xl bg-white p-3 shadow-sm ring-1 ${n.urgent ? "ring-red-200 border-l-4 border-[#C71F2D]" : "ring-[#C71F2D]/10"}`}>
                  <p className="text-sm font-black text-[#071D5B]">{n.title}</p>
                  <p className="text-xs text-slate-400">{n.date}</p>
                </div>
              ))
            )}
            <Link href="/portal-funcionario/painel/secretaria/comunicados"
              className="text-xs font-bold text-[#C71F2D] hover:underline">
              Gerenciar comunicados →
            </Link>
          </div>
        </div>
      </div>

      {/* Top debtors preview */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-400">Maiores Devedores</h2>
          <Link href="/portal-funcionario/painel/diretoria/financeiro"
            className="text-xs font-bold text-[#C71F2D] hover:underline">
            Ver análise completa →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {DEBTORS.slice(0, 3).map((d: { id: string; guardianName: string; studentName: string; unit: string; totalOwed: number; monthsDelay: number; isOverdue: boolean }) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#C71F2D]/10">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#071D5B]">{d.guardianName}</p>
                <p className="text-xs text-slate-500">{d.studentName} · {d.unit} · {d.monthsDelay} mes{d.monthsDelay > 1 ? "es" : ""} em atraso</p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#C71F2D]">
                  {d.totalOwed.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                {d.isOverdue && <p className="text-[10px] font-bold text-red-500">Vencido</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Root dashboard (role-aware) ─────────────────────────────────────────────
export default function PainelDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("portal_funcionario")
    if (data) setEmployee(JSON.parse(data))
  }, [])

  if (!employee) return null

  if (employee.tipo === "professor")  return <TeacherDashboard />
  if (employee.tipo === "secretaria") return <SecretaryDashboard />
  if (employee.tipo === "diretora")   return <DirectorDashboard />

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-black text-[#071D5B]">Bem-vindo!</h1>
    </div>
  )
}
