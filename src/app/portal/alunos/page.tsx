"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronRight, LogOut } from "lucide-react"
import Image from "next/image"
import type { Guardian } from "@/lib/portal/types"
import { MOCK_STUDENTS } from "@/lib/portal/mock-data"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function AlunosPage() {
  const router = useRouter()
  const [guardian, setGuardian] = useState<Guardian | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("portal_guardian")
    if (!stored) {
      router.replace("/portal")
      return
    }
    setGuardian(JSON.parse(stored))
  }, [router])

  function handleLogout() {
    sessionStorage.removeItem("portal_guardian")
    router.push("/portal")
  }

  if (!guardian) return null

  const students = MOCK_STUDENTS.filter((s) =>
    s.guardianIds.includes(guardian.id)
  )

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Header */}
      <header className="bg-[#071D5B] px-4 pb-6 pt-10 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-coracao-de-maria.png"
              alt="Coração de Maria"
              width={80}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-lg">
          <p className="text-sm font-bold text-blue-300">Olá,</p>
          <h1 className="text-2xl font-black text-white">{guardian.name}</h1>
          <p className="mt-1 text-sm text-blue-200">
            Selecione o aluno para acompanhar
          </p>
        </div>
      </header>

      {/* Students */}
      <main className="mx-auto max-w-lg px-4 pb-10 sm:px-6">
        <div className="mt-6 flex flex-col gap-6">
          {students.map((student) => {
            const isBoy = student.gender === "M"
            const cardBg = isBoy
              ? "from-[#0057D9] to-[#071D5B]"
              : "from-[#E4252A] to-[#9B1B1E]"
            const accentColor = isBoy ? "#0057D9" : "#E4252A"
            const initials = getInitials(student.name)

            return (
              <div key={student.id} className="pt-10">
                <button
                  onClick={() => router.push(`/portal/aluno/${student.id}`)}
                  className="relative w-full text-left"
                >
                  <article
                    className={`relative flex items-stretch rounded-2xl bg-linear-to-br ${cardBg} shadow-xl`}
                  >
                    {/* Photo / Avatar — overflows upward */}
                    <div className="relative -mt-10 ml-4 mb-4 w-24 shrink-0 self-stretch">
                      {student.photoPath ? (
                        <div className="relative h-44 w-24 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/25">
                          <Image
                            src={student.photoPath}
                            alt={student.name}
                            fill
                            className="object-cover object-top"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-44 w-24 flex-col items-center">
                          <div
                            className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/30"
                          >
                            <span className="text-xl font-black" style={{ color: accentColor }}>
                              {initials}
                            </span>
                          </div>
                          <div className="-mt-2 w-12 flex-1 rounded-b-2xl bg-white/20" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 items-center gap-2 py-4 pl-3 pr-3 text-white">
                      <div className="flex-1">
                        <h2 className="text-lg font-black leading-tight">
                          {student.name}
                        </h2>
                        <p className="mt-1 text-sm opacity-85">
                          {student.grade} {student.class} — {student.etapa} · {student.shift}
                        </p>
                        <p className="mt-0.5 text-sm opacity-70">{student.teacher}</p>
                        <p className="mt-0.5 text-xs opacity-60">
                          Unidade {student.unit}
                        </p>

                        {student.notifications > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1">
                            <Bell size={13} />
                            <span className="text-xs font-bold">
                              {student.notifications} novidade
                              {student.notifications > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <ChevronRight size={20} className="opacity-60" />
                    </div>

                    {/* Notification badge */}
                    {student.notifications > 0 && (
                      <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                        <span
                          className="text-xs font-black"
                          style={{ color: "#E4252A" }}
                        >
                          {student.notifications}
                        </span>
                      </div>
                    )}
                  </article>
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
