"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart2,
  Bell,
  CalendarRange,
  ClipboardList,
  GalleryHorizontal,
  Home,
  Landmark,
  LogOut,
  Menu,
  MessageCircle,
  Users,
  UserPlus,
  X,
} from "lucide-react"
import { TEACHER_CLASSES, loadChat, getAllTeacherStudents } from "@/lib/portal-funcionario/mock-data"

export type Employee = {
  id: string
  username: string
  nome: string
  cargo: string
  tipo: "diretora" | "secretaria" | "professor"
  turmas?: string[]
}

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  section?: string   // renders a labelled divider before this item in the sidebar
  shortLabel?: string
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function useTeacherUnread() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let total = 0
    for (const s of getAllTeacherStudents())
      total += loadChat(s.id).filter((m) => m.from === "guardian" && !m.read).length
    setCount(total)
  }, [])
  return count
}

function buildNavItems(tipo: Employee["tipo"]): NavItem[] {
  const home: NavItem = { label: "Início", href: "/portal-funcionario/painel", icon: Home, shortLabel: "Início" }

  if (tipo === "professor") {
    return [
      home,
      ...TEACHER_CLASSES.map((t, i) => ({
        label:      t.label,
        href:       `/portal-funcionario/painel/turma/${t.id}`,
        icon:       Users,
        shortLabel: t.shortLabel,
        section:    i === 0 ? "TURMAS" : undefined,
      })),
      { label: "Agenda Individual", href: "/portal-funcionario/painel/agendas", icon: ClipboardList, shortLabel: "Agendas" },
      { label: "Chat",              href: "/portal-funcionario/painel/chat",    icon: MessageCircle, shortLabel: "Chat"   },
    ]
  }

  if (tipo === "secretaria") {
    return [
      home,
      { label: "Cadastros",     href: "/portal-funcionario/painel/secretaria/cadastros",   icon: UserPlus,          section: "GESTÃO",    shortLabel: "Cadastros" },
      { label: "Agenda Escolar", href: "/portal-funcionario/painel/secretaria/agenda",      icon: CalendarRange,     section: "ESCOLAR",   shortLabel: "Agenda"    },
      { label: "Comunicados",    href: "/portal-funcionario/painel/secretaria/comunicados", icon: Bell,              shortLabel: "Avisos"  },
      { label: "Galeria",        href: "/portal-funcionario/painel/secretaria/galeria",     icon: GalleryHorizontal, shortLabel: "Galeria" },
      { label: "Financeiro",     href: "/portal-funcionario/painel/secretaria/financeiro",  icon: Landmark,          shortLabel: "Banco"   },
    ]
  }

  if (tipo === "diretora") {
    return [
      home,
      { label: "Cadastros",            href: "/portal-funcionario/painel/secretaria/cadastros",  icon: UserPlus,          section: "GESTÃO",     shortLabel: "Cadastros" },
      { label: "Dashboard Financeiro", href: "/portal-funcionario/painel/diretoria/financeiro",  icon: BarChart2,         section: "FINANCEIRO", shortLabel: "Finanças"  },
      { label: "Retorno Bancário",     href: "/portal-funcionario/painel/secretaria/financeiro", icon: Landmark,          shortLabel: "Banco"    },
      { label: "Agenda Escolar",       href: "/portal-funcionario/painel/secretaria/agenda",     icon: CalendarRange,     section: "SECRETARIA", shortLabel: "Agenda"    },
      { label: "Comunicados",          href: "/portal-funcionario/painel/secretaria/comunicados",icon: Bell,              shortLabel: "Avisos"   },
      { label: "Galeria",              href: "/portal-funcionario/painel/secretaria/galeria",    icon: GalleryHorizontal, shortLabel: "Galeria"  },
      { label: "1º Ano A — Manhã",    href: "/portal-funcionario/painel/turma/1a-manha",        icon: Users,             section: "PEDAGÓGICO", shortLabel: "1A Manhã"  },
      { label: "1º Ano B — Tarde",    href: "/portal-funcionario/painel/turma/1b-tarde",        icon: Users,             shortLabel: "1B Tarde" },
      { label: "Agenda Individual",    href: "/portal-funcionario/painel/agendas",              icon: ClipboardList,     shortLabel: "Agendas"  },
      { label: "Chat",                 href: "/portal-funcionario/painel/chat",                 icon: MessageCircle,     shortLabel: "Chat"     },
    ]
  }

  return [home]
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const teacherUnread = useTeacherUnread()

  useEffect(() => {
    const data = localStorage.getItem("portal_funcionario")
    if (!data) { router.replace("/portal-funcionario"); return }
    setEmployee(JSON.parse(data))
  }, [router])

  function handleLogout() {
    localStorage.removeItem("portal_funcionario")
    router.push("/portal-funcionario")
  }

  if (!employee) return null

  const initials = getInitials(employee.nome)
  const navItems = buildNavItems(employee.tipo)
  const bottomNav = navItems.filter((i) => !i.section).slice(0, 4).length >= 4
    ? navItems.filter((i) => !i.section).slice(0, 4)
    : navItems.slice(0, 4)

  function isActive(href: string) {
    return href === "/portal-funcionario/painel"
      ? pathname === href
      : pathname.startsWith(href)
  }

  function badgeCount(item: NavItem) {
    const tipo = employee?.tipo
    if ((tipo === "professor" || tipo === "diretora") && item.label === "Chat")
      return teacherUnread
    return 0
  }

  const SidebarLink = ({ item, mobile = false, onClick }: {
    item: NavItem; mobile?: boolean; onClick?: () => void
  }) => {
    const Icon   = item.icon
    const active = isActive(item.href)
    const badge  = badgeCount(item)
    const base   = mobile
      ? "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold transition"
      : "mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition"
    const color  = active
      ? `${base} bg-white/20 text-white`
      : `${base} text-white/80 hover:bg-white/10 hover:text-white`

    return (
      <Link href={item.href} className={color} onClick={onClick}>
        <Icon size={mobile ? 20 : 17} className="shrink-0" />
        <span className="truncate">{item.label}</span>
        {badge > 0 && (
          <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-black ${
            active ? "bg-white text-[#4A0010]" : "bg-white/20 text-white"}`}>
            {badge}
          </span>
        )}
      </Link>
    )
  }

  const NavList = ({ mobile, onClickItem }: { mobile?: boolean; onClickItem?: () => void }) => (
    <>
      {navItems.map((item) => (
        <React.Fragment key={item.href}>
          {item.section && (
            <div className={`${mobile ? "mt-4 mb-1 px-4" : "mt-3 mb-1 px-3"}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.section}</p>
            </div>
          )}
          <SidebarLink item={item} mobile={mobile} onClick={onClickItem} />
        </React.Fragment>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-[#FFF5F5]">

      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 grid grid-rows-[auto_auto_1fr_auto] overflow-hidden bg-[#4A0010] shadow-xl md:grid lg:w-72">
        <div className="shrink-0 flex flex-col items-center gap-2 border-b border-white/10 px-4 py-5">
          <Image src="/images/logo-coracao-de-maria.png" alt="Coração de Maria"
            width={100} height={50} className="h-11 w-auto object-contain brightness-0 invert" />
          <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Portal do Funcionário</span>
        </div>

        <div className="shrink-0 mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-black text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{employee.nome}</p>
            <p className="truncate text-xs text-white/60">{employee.cargo}</p>
          </div>
        </div>

        <nav className="no-scrollbar mt-3 flex flex-col overflow-y-auto px-3 pb-2">
          <NavList />
        </nav>

        <div className="shrink-0 border-t border-white/10 px-3 py-3">
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white">
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-[#4A0010] px-4 shadow-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-black text-white">
            {initials}
          </div>
          <span className="max-w-40 truncate text-sm font-black text-white">{employee.nome}</span>
        </div>
        <button onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
          aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#4A0010] md:hidden">
          <div className="flex items-center justify-between px-4 pt-10 pb-4">
            <h2 className="text-lg font-black text-white">Menu</h2>
            <button onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-base font-black text-white">
                {initials}
              </div>
              <div>
                <p className="text-base font-black text-white">{employee.nome}</p>
                <p className="text-sm text-white/60">{employee.cargo}</p>
              </div>
            </div>
            <nav className="flex flex-col">
              <NavList mobile onClickItem={() => setMenuOpen(false)} />
            </nav>
            <div className="mt-4 border-t border-white/10 pt-4">
              <button onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold text-white/60 hover:bg-white/10 hover:text-white">
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="pb-20 pt-14 md:pl-64 md:pb-6 md:pt-0 lg:pl-72">{children}</main>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-slate-200 bg-white shadow-xl md:hidden">
        {bottomNav.map((item) => {
          const Icon   = item.icon
          const active = isActive(item.href)
          const badge  = badgeCount(item)
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition ${
                active ? "text-[#C71F2D]" : "text-slate-400"
              }`}>
              <div className="relative">
                <Icon size={21} />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C71F2D] text-[9px] font-black text-white">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold leading-none">{item.shortLabel ?? item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
        <button onClick={() => setMenuOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-slate-400">
          <Menu size={21} />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </nav>
    </div>
  )
}
