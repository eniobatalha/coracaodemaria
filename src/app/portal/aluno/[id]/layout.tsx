"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ClipboardList,
  FileText,
  GalleryHorizontal,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Users,
  WalletCards,
  X,
} from "lucide-react"
import type { Guardian, Student } from "@/lib/portal/types"
import { MOCK_STUDENTS, MOCK_CHAT_MESSAGES } from "@/lib/portal/mock-data"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const navItems = [
  { label: "Início",            href: "",                  icon: Home              },
  { label: "Boletim",           href: "/boletim",          icon: BookOpen          },
  { label: "Frequência",        href: "/frequencia",       icon: CalendarDays      },
  { label: "Agenda da Escola",  href: "/agenda-escola",    icon: CalendarRange     },
  { label: "Agenda Individual", href: "/agenda-individual", icon: ClipboardList    },
  { label: "Comunicados",       href: "/comunicados",      icon: Bell              },
  { label: "Chat",              href: "/chat",             icon: MessageCircle     },
  { label: "Galeria",           href: "/galeria",          icon: GalleryHorizontal },
  { label: "Financeiro",        href: "/financeiro",       icon: WalletCards       },
  { label: "Declarações",       href: "/declaracoes",      icon: FileText          },
]

const bottomNavItems = navItems.slice(0, 4)

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const params   = useParams()
  const pathname = usePathname()
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [student,  setStudent]  = useState<Student  | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const studentId = params.id as string

  useEffect(() => {
    const stored = localStorage.getItem("portal_guardian")
    if (!stored) { router.replace("/portal"); return }
    setGuardian(JSON.parse(stored))
    const found = MOCK_STUDENTS.find((s) => s.id === studentId)
    if (!found) { router.replace("/portal/alunos"); return }
    setStudent(found)
  }, [router, studentId])

  function handleLogout() {
    localStorage.removeItem("portal_guardian")
    router.push("/portal")
  }

  if (!guardian || !student) return null

  const isBoy       = student.gender === "M"
  const accentColor = isBoy ? "#0057D9" : "#E4252A"
  const initials    = getInitials(student.name)

  const chatMessages = MOCK_CHAT_MESSAGES[studentId] ?? []
  const unreadChat   = chatMessages.filter((m) => m.from === "teacher" && !m.read).length

  function isActive(href: string) {
    const full = `/portal/aluno/${studentId}${href}`
    return href === "" ? pathname === full : pathname.startsWith(full)
  }

  const StudentAvatar = ({ size, ring }: { size: string; ring: string }) => (
    <div className={`relative ${size} overflow-hidden rounded-full bg-white ${ring}`}>
      {student.photoPath ? (
        <Image src={student.photoPath} alt={student.name} fill
          className="object-cover object-top"
          sizes={size.includes("20") ? "80px" : size.includes("10") ? "40px" : "32px"} />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-black"
          style={{ color: accentColor }}>{initials}</span>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F0F4FF]">

      {/* ── Desktop sidebar — fixed so it never gets clipped ── */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 shrink-0 flex-col bg-white shadow-xl md:flex lg:w-72">

        {/* Logo */}
        <div className="shrink-0 flex flex-col items-center gap-2 border-b border-slate-100 px-4 py-5">
          <Image src="/images/logo-coracao-de-maria.png" alt="Coração de Maria"
            width={100} height={50} className="h-11 w-auto object-contain" />
        </div>

        {/* Student info */}
        <div className="shrink-0 mx-4 mt-4 flex flex-col items-center gap-3 rounded-2xl p-4 text-center"
          style={{ backgroundColor: `${accentColor}15` }}>
          <StudentAvatar size="h-20 w-20" ring="shadow-lg ring-4 ring-white" />
          <div className="w-full min-w-0">
            <p className="text-sm font-black uppercase tracking-wide text-[#071D5B]">{student.name}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">
              {student.grade} {student.class} — {student.etapa ?? ""}
            </p>
            {student.matricula && (
              <p className="mt-0.5 text-xs text-slate-400">
                Matrícula: {student.matricula.padStart(6, "0")}
              </p>
            )}
            <p className="mt-0.5 text-xs text-slate-400">Situação: MATRICULADO — Ano: 2026</p>
          </div>
        </div>

        {/* Nav — min-h-0 forces flex shrink so footer always shows */}
        <nav className="no-scrollbar mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-2">
          {navItems.map((item) => {
            const Icon   = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={`/portal/aluno/${studentId}${item.href}`}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  active ? "bg-[#E4252A] text-white shadow-sm" : "text-[#071D5B] hover:bg-slate-100"
                }`}>
                <Icon size={18} />
                {item.label}
                {item.label === "Comunicados" && student.notifications > 0 && (
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${
                    active ? "bg-white text-[#E4252A]" : "bg-[#E4252A] text-white"}`}>
                    {student.notifications}
                  </span>
                )}
                {item.label === "Chat" && unreadChat > 0 && (
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${
                    active ? "bg-white text-[#E4252A]" : "bg-[#E4252A] text-white"}`}>
                    {unreadChat}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer — always visible */}
        <div className="shrink-0 border-t border-slate-100 px-3 py-3 flex flex-col gap-1">
          <Link href="/portal/alunos"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#071D5B] hover:bg-slate-100">
            <Users size={18} />
            Trocar Aluno
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#E4252A] hover:bg-red-50">
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-[#071D5B] px-4 shadow-lg md:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            aria-label="Voltar">
            <ChevronLeft size={22} />
          </button>
          <div className="relative h-8 w-8 overflow-hidden rounded-full" style={{ backgroundColor: accentColor }}>
            {student.photoPath ? (
              <Image src={student.photoPath} alt={student.name} fill
                className="object-cover object-top" sizes="32px" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-black text-white">
                {initials}
              </span>
            )}
          </div>
          <span className="max-w-35 truncate text-sm font-black text-white">{student.name}</span>
        </div>
        <button onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
          aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile full-screen menu drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#071D5B] md:hidden">
          <div className="flex items-center justify-between px-4 pt-10 pb-4">
            <h2 className="text-lg font-black text-white">Menu</h2>
            <button onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Fechar menu">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            {/* Student card in drawer */}
            <div className="mb-4 flex flex-col items-center gap-3 rounded-2xl p-4 text-center"
              style={{ backgroundColor: `${accentColor}30` }}>
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white/40">
                {student.photoPath ? (
                  <Image src={student.photoPath} alt={student.name} fill
                    className="object-cover object-top" sizes="80px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl font-black"
                    style={{ color: accentColor }}>{initials}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">{student.name}</p>
                <p className="mt-0.5 text-xs font-bold text-blue-200">
                  {student.grade} {student.class} — {student.etapa ?? ""}
                </p>
                {student.matricula && (
                  <p className="mt-0.5 text-xs text-blue-300">
                    Matrícula: {student.matricula.padStart(6, "0")}
                  </p>
                )}
                <p className="text-xs text-blue-300">Situação: MATRICULADO — Ano: 2026</p>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon   = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={`/portal/aluno/${studentId}${item.href}`}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold transition ${
                      active ? "bg-[#E4252A] text-white" : "text-white hover:bg-white/10"
                    }`}>
                    <Icon size={20} />
                    {item.label}
                    {item.label === "Comunicados" && student.notifications > 0 && (
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${
                        active ? "bg-white text-[#E4252A]" : "bg-[#E4252A] text-white"}`}>
                        {student.notifications}
                      </span>
                    )}
                    {item.label === "Chat" && unreadChat > 0 && (
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${
                        active ? "bg-white text-[#E4252A]" : "bg-[#E4252A] text-white"}`}>
                        {unreadChat}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 border-t border-white/15 pt-4 flex flex-col gap-1">
              <Link href="/portal/alunos" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold text-white hover:bg-white/10">
                <Users size={20} />
                Trocar Aluno
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold text-[#FF7A7A] hover:bg-white/10">
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content — offset by sidebar width on md+ ── */}
      <main className="pb-20 pt-14 md:pl-64 md:pb-6 md:pt-0 lg:pl-72">{children}</main>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-slate-200 bg-white shadow-xl md:hidden">
        {bottomNavItems.map((item) => {
          const Icon   = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={`/portal/aluno/${studentId}${item.href}`}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold transition ${
                active ? "text-[#E4252A]" : "text-slate-400"
              }`}>
              <Icon size={22} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
        <button onClick={() => setMenuOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold text-slate-400">
          <Menu size={22} />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>
    </div>
  )
}
