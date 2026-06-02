"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  FileText,
  GalleryHorizontal,
  WalletCards,
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_NOTICES, MOCK_ATTENDANCE, MOCK_BOLETOS } from "@/lib/portal/mock-data"

export default function StudentDashboard() {
  const params = useParams()
  const studentId = params.id as string
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)

  if (!student) return null

  const notices = MOCK_NOTICES[studentId] ?? []
  const unreadNotices = notices.filter((n) => !n.read).length

  const attendance = MOCK_ATTENDANCE[studentId] ?? []
  const totalDays = attendance.reduce((sum, m) => sum + m.workingDays, 0)
  const totalAbsences = attendance.reduce((sum, m) => sum + m.absences, 0)
  const attendancePct =
    totalDays > 0
      ? Math.round(((totalDays - totalAbsences) / totalDays) * 100)
      : 100

  const boletos = MOCK_BOLETOS[studentId] ?? []
  const pendingBoletos = boletos.filter((b) => b.status !== "Pago").length
  const vencidos = boletos.filter((b) => b.status === "Vencido").length

  const menuItems = [
    {
      label: "Boletim",
      href: `/portal/aluno/${studentId}/boletim`,
      icon: BookOpen,
      sub: "Notas do bimestre",
      badge: null,
      color: "#0057D9",
    },
    {
      label: "Frequência",
      href: `/portal/aluno/${studentId}/frequencia`,
      icon: CalendarDays,
      sub: `${attendancePct}% de presença`,
      badge: null,
      color: "#22c55e",
    },
    {
      label: "Agenda da Escola",
      href: `/portal/aluno/${studentId}/agenda-escola`,
      icon: CalendarRange,
      sub: "Eventos e prazos",
      badge: null,
      color: "#FF7A1C",
    },
    {
      label: "Agenda Individual",
      href: `/portal/aluno/${studentId}/agenda-individual`,
      icon: ClipboardList,
      sub: "Anotações da professora",
      badge: null,
      color: "#6366f1",
    },
    {
      label: "Avisos",
      href: `/portal/aluno/${studentId}/avisos`,
      icon: Bell,
      sub: unreadNotices > 0 ? `${unreadNotices} não lido${unreadNotices > 1 ? "s" : ""}` : "Nenhum novo aviso",
      badge: unreadNotices > 0 ? unreadNotices : null,
      color: "#E4252A",
    },
    {
      label: "Galeria",
      href: `/portal/aluno/${studentId}/galeria`,
      icon: GalleryHorizontal,
      sub: "Fotos e atividades",
      badge: null,
      color: "#ec4899",
    },
    {
      label: "Financeiro",
      href: `/portal/aluno/${studentId}/financeiro`,
      icon: WalletCards,
      sub: vencidos > 0
        ? `⚠️ ${vencidos} boleto${vencidos > 1 ? "s" : ""} vencido${vencidos > 1 ? "s" : ""}`
        : pendingBoletos > 0
        ? `${pendingBoletos} em aberto`
        : "Em dia",
      badge: pendingBoletos > 0 ? pendingBoletos : null,
      color: "#071D5B",
    },
    {
      label: "Declarações",
      href: `/portal/aluno/${studentId}/declaracoes`,
      icon: FileText,
      sub: "Documentos escolares",
      badge: null,
      color: "#6366f1",
    },
  ]

  return (
    <div className="px-4 py-6 sm:px-6">
      {/* Welcome */}
      <div className="mb-6 hidden md:block">
        <h1 className="text-2xl font-black text-[#071D5B]">
          Olá, bem-vindo ao portal de {student.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {student.grade} · Turma {student.class} · {student.shift} · Unidade{" "}
          {student.unit}
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Frequência
          </p>
          <p className="mt-1 text-3xl font-black text-[#071D5B]">
            {attendancePct}%
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Faltas
          </p>
          <p className="mt-1 text-3xl font-black text-[#071D5B]">
            {totalAbsences}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl bg-white p-4 shadow-sm sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Avisos não lidos
          </p>
          <p className="mt-1 text-3xl font-black text-[#E4252A]">
            {unreadNotices}
          </p>
        </div>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon size={24} style={{ color: item.color }} />
              </div>
              <h2 className="text-sm font-black text-[#071D5B]">
                {item.label}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>

              {item.badge !== null && (
                <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#E4252A] shadow">
                  <span className="text-xs font-black text-white">
                    {item.badge}
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        {student.teacher} · Unidade {student.unit}
      </p>
    </div>
  )
}
