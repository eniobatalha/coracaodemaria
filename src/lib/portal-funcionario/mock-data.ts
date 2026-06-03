import type { Student, SubjectGrade, AttendanceMonth, AgendaEntry, ChatMessage, Guardian } from "@/lib/portal/types"
import {
  MOCK_STUDENTS,
  MOCK_GRADES,
  MOCK_ATTENDANCE,
  MOCK_AGENDA_ENTRIES,
  MOCK_CHAT_MESSAGES,
  MOCK_GUARDIANS,
} from "@/lib/portal/mock-data"

export type TurmaClass = {
  id: string
  grade: string
  class: string
  shift: "Manhã" | "Tarde"
  label: string
  shortLabel: string
  studentIds: string[]
}

export const TEACHER_CLASSES: TurmaClass[] = [
  {
    id: "1a-manha",
    grade: "1º Ano",
    class: "A",
    shift: "Manhã",
    label: "1º Ano A — Manhã",
    shortLabel: "1A Manhã",
    studentIds: ["s3", "s4", "s5"],
  },
  {
    id: "1b-tarde",
    grade: "1º Ano",
    class: "B",
    shift: "Tarde",
    label: "1º Ano B — Tarde",
    shortLabel: "1B Tarde",
    studentIds: ["s2", "s6", "s7"],
  },
]

export function getStudentsByTurma(turmaId: string): Student[] {
  const turma = TEACHER_CLASSES.find((t) => t.id === turmaId)
  if (!turma) return []
  return turma.studentIds
    .map((id) => MOCK_STUDENTS.find((s) => s.id === id))
    .filter(Boolean) as Student[]
}

export function getTurmaByStudentId(studentId: string): TurmaClass | undefined {
  return TEACHER_CLASSES.find((t) => t.studentIds.includes(studentId))
}

export function getGuardianForStudent(studentId: string): Guardian | null {
  const student = MOCK_STUDENTS.find((s) => s.id === studentId)
  if (!student || !student.guardianIds.length) return null
  return MOCK_GUARDIANS[student.guardianIds[0]] ?? null
}

export function getAllTeacherStudents(): Student[] {
  const ids = TEACHER_CLASSES.flatMap((t) => t.studentIds)
  return ids.map((id) => MOCK_STUDENTS.find((s) => s.id === id)).filter(Boolean) as Student[]
}

// ─── sessionStorage helpers ───────────────────────────────────────────────────

const KEY_GRADES     = "pf_grades"
const KEY_AGENDA     = "pf_agenda"
const KEY_CHAT       = "pf_chat"
const KEY_ATTENDANCE = "pf_attendance"

export function loadGrades(studentId: string): SubjectGrade[] {
  try {
    const raw = sessionStorage.getItem(KEY_GRADES)
    if (raw) {
      const all = JSON.parse(raw) as Record<string, SubjectGrade[]>
      if (all[studentId]) return all[studentId]
    }
  } catch { /* ignore */ }
  return MOCK_GRADES[studentId] ?? []
}

export function saveGrades(studentId: string, grades: SubjectGrade[]) {
  try {
    const all = JSON.parse(sessionStorage.getItem(KEY_GRADES) ?? "{}") as Record<string, SubjectGrade[]>
    all[studentId] = grades
    sessionStorage.setItem(KEY_GRADES, JSON.stringify(all))
  } catch { /* ignore */ }
}

export function loadAttendance(studentId: string): AttendanceMonth[] {
  try {
    const raw = sessionStorage.getItem(KEY_ATTENDANCE)
    if (raw) {
      const all = JSON.parse(raw) as Record<string, AttendanceMonth[]>
      if (all[studentId]) return all[studentId]
    }
  } catch { /* ignore */ }
  return MOCK_ATTENDANCE[studentId] ?? []
}

export function saveAttendance(studentId: string, months: AttendanceMonth[]) {
  try {
    const all = JSON.parse(sessionStorage.getItem(KEY_ATTENDANCE) ?? "{}") as Record<string, AttendanceMonth[]>
    all[studentId] = months
    sessionStorage.setItem(KEY_ATTENDANCE, JSON.stringify(all))
  } catch { /* ignore */ }
}

export function loadAgenda(studentId: string): AgendaEntry[] {
  try {
    const raw = sessionStorage.getItem(KEY_AGENDA)
    if (raw) {
      const all = JSON.parse(raw) as Record<string, AgendaEntry[]>
      if (all[studentId]) return all[studentId]
    }
  } catch { /* ignore */ }
  return MOCK_AGENDA_ENTRIES[studentId] ?? []
}

export function saveAgenda(studentId: string, entries: AgendaEntry[]) {
  try {
    const all = JSON.parse(sessionStorage.getItem(KEY_AGENDA) ?? "{}") as Record<string, AgendaEntry[]>
    all[studentId] = entries
    sessionStorage.setItem(KEY_AGENDA, JSON.stringify(all))
  } catch { /* ignore */ }
}

export function loadChat(studentId: string): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(KEY_CHAT)
    if (raw) {
      const all = JSON.parse(raw) as Record<string, ChatMessage[]>
      if (all[studentId]) return all[studentId]
    }
  } catch { /* ignore */ }
  return MOCK_CHAT_MESSAGES[studentId] ?? []
}

export function saveChat(studentId: string, messages: ChatMessage[]) {
  try {
    const all = JSON.parse(sessionStorage.getItem(KEY_CHAT) ?? "{}") as Record<string, ChatMessage[]>
    all[studentId] = messages
    sessionStorage.setItem(KEY_CHAT, JSON.stringify(all))
  } catch { /* ignore */ }
}
