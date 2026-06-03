import type { SchoolEvent, GalleryAlbum } from "@/lib/portal/types"
import { MOCK_SCHOOL_EVENTS, MOCK_BOLETOS, MOCK_STUDENTS } from "@/lib/portal/mock-data"

// ─── Storage keys ─────────────────────────────────────────────────────────────
const KEY_EVENTS    = "pf_sec_events"
const KEY_NOTICES   = "pf_sec_notices"
const KEY_GALLERY   = "pf_sec_gallery"
const KEY_BOLETOS   = "pf_sec_boletos"

// ─── School Events ────────────────────────────────────────────────────────────
export function loadSchoolEvents(): SchoolEvent[] {
  try {
    const raw = sessionStorage.getItem(KEY_EVENTS)
    if (raw) return JSON.parse(raw) as SchoolEvent[]
  } catch { /* ignore */ }
  return [...MOCK_SCHOOL_EVENTS]
}

export function saveSchoolEvents(events: SchoolEvent[]) {
  try { sessionStorage.setItem(KEY_EVENTS, JSON.stringify(events)) } catch { /* ignore */ }
}

// ─── Broadcast Notices ────────────────────────────────────────────────────────
export type BroadcastNotice = {
  id: string
  date: string
  title: string
  content: string
  urgent: boolean
  target: "all" | "gaibu" | "cabo" | "1a-manha" | "1b-tarde" | "4a"
  targetLabel: string
}

const MOCK_BROADCAST_NOTICES: BroadcastNotice[] = [
  {
    id: "bn1",
    date: "2026-06-01",
    title: "Reunião de Pais — 10/06 às 19h",
    content: "A reunião de pais e mestres acontecerá no dia 10 de junho, às 19h. Conta-se com a presença de todos os responsáveis para acompanhar o desempenho dos alunos no 3º bimestre.",
    urgent: false,
    target: "all",
    targetLabel: "Todos os alunos",
  },
  {
    id: "bn2",
    date: "2026-05-28",
    title: "⚠️ Cancelamento de aula — 30/05",
    content: "As aulas do dia 30/05 foram canceladas devido à formação pedagógica dos professores. Retorno na segunda-feira, 02/06.",
    urgent: true,
    target: "all",
    targetLabel: "Todos os alunos",
  },
]

export function loadBroadcastNotices(): BroadcastNotice[] {
  try {
    const raw = sessionStorage.getItem(KEY_NOTICES)
    if (raw) return JSON.parse(raw) as BroadcastNotice[]
  } catch { /* ignore */ }
  return [...MOCK_BROADCAST_NOTICES]
}

export function saveBroadcastNotices(notices: BroadcastNotice[]) {
  try { sessionStorage.setItem(KEY_NOTICES, JSON.stringify(notices)) } catch { /* ignore */ }
}

// ─── Secretary Gallery Albums ─────────────────────────────────────────────────
export type SecGalleryAlbum = {
  id: string
  date: string
  title: string
  description: string
  target: string
  targetLabel: string
  color: string
  photos: string[] // picsum seeds
}

const MOCK_SEC_GALLERY: SecGalleryAlbum[] = [
  {
    id: "sg1", date: "2026-06-01",
    title: "Festa de São João — Gaibu",
    description: "Fotos da festa junina da Unidade Gaibu com toda a turma.",
    target: "gaibu", targetLabel: "Unidade Gaibu",
    color: "#f59e0b",
    photos: ["sj1", "sj2", "sj3", "sj4", "sj5", "sj6"],
  },
]

export function loadSecGallery(): SecGalleryAlbum[] {
  try {
    const raw = sessionStorage.getItem(KEY_GALLERY)
    if (raw) return JSON.parse(raw) as SecGalleryAlbum[]
  } catch { /* ignore */ }
  return [...MOCK_SEC_GALLERY]
}

export function saveSecGallery(albums: SecGalleryAlbum[]) {
  try { sessionStorage.setItem(KEY_GALLERY, JSON.stringify(albums)) } catch { /* ignore */ }
}

// ─── Boletos (all students) for secretary financial view ──────────────────────
export type BoletoFull = {
  id: string
  studentId: string
  studentName: string
  matricula: string
  guardianId: string
  title: string
  value: number
  dueDate: string
  status: "Pago" | "A vencer" | "Vencido"
  barcode: string
}

function buildAllBoletos(): BoletoFull[] {
  const result: BoletoFull[] = []
  for (const [studentId, boletos] of Object.entries(MOCK_BOLETOS)) {
    const student = MOCK_STUDENTS.find((s) => s.id === studentId)
    if (!student) continue
    for (const b of boletos) {
      result.push({
        id:          b.id,
        studentId,
        studentName: student.name,
        matricula:   student.matricula ?? "",
        guardianId:  student.guardianIds[0] ?? "",
        title:       b.title,
        value:       b.value,
        dueDate:     b.dueDate,
        status:      b.status,
        barcode:     b.barcode,
      })
    }
  }
  return result
}

export function loadAllBoletos(): BoletoFull[] {
  try {
    const raw = sessionStorage.getItem(KEY_BOLETOS)
    if (raw) return JSON.parse(raw) as BoletoFull[]
  } catch { /* ignore */ }
  return buildAllBoletos()
}

export function saveAllBoletos(boletos: BoletoFull[]) {
  try { sessionStorage.setItem(KEY_BOLETOS, JSON.stringify(boletos)) } catch { /* ignore */ }
}

// ─── Debtors summary ──────────────────────────────────────────────────────────
export type DebtorSummary = {
  studentId:   string
  studentName: string
  matricula:   string
  guardianId:  string
  totalOwed:   number
  hasOverdue:  boolean
  items:       { title: string; value: number; status: string; dueDate: string }[]
}

export function getDebtors(boletos: BoletoFull[]): DebtorSummary[] {
  const map = new Map<string, DebtorSummary>()

  for (const b of boletos) {
    if (b.status === "Pago") continue

    if (!map.has(b.studentId)) {
      map.set(b.studentId, {
        studentId:   b.studentId,
        studentName: b.studentName,
        matricula:   b.matricula,
        guardianId:  b.guardianId,
        totalOwed:   0,
        hasOverdue:  false,
        items:       [],
      })
    }

    const entry = map.get(b.studentId)!
    entry.totalOwed += b.value
    entry.hasOverdue = entry.hasOverdue || b.status === "Vencido"
    entry.items.push({ title: b.title, value: b.value, status: b.status, dueDate: b.dueDate })
  }

  return [...map.values()].sort((a, b) => (b.hasOverdue ? 1 : 0) - (a.hasOverdue ? 1 : 0))
}

// ─── CNAB-like return file parser ─────────────────────────────────────────────
export type CnabRecord = {
  seq:       string
  boletoId:  string
  matricula: string
  status:    "PAGO" | "REJEITADO"
  value:     number
  date:      string
}

export const DEMO_CNAB = `RETORNO BRADESCO 03/06/2026 CORAÇÃO DE MARIA
SEQ;ID_BOLETO;MATRICULA;STATUS;VALOR;DT_PAGTO
001;b1;000363;PAGO;850,00;03/06/2026
002;b6;000262;PAGO;750,00;03/06/2026
TRAILER;002;REGISTROS PROCESSADOS`

export function parseCnab(text: string): CnabRecord[] {
  const records: CnabRecord[] = []
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)

  for (const line of lines) {
    if (line.startsWith("RETORNO") || line.startsWith("SEQ") || line.startsWith("TRAILER")) continue
    const parts = line.split(";")
    if (parts.length < 6) continue
    const [seq, boletoId, matricula, status, valueStr, date] = parts
    if (status !== "PAGO" && status !== "REJEITADO") continue
    const value = parseFloat(valueStr.replace(",", ".")) || 0
    records.push({ seq: seq.trim(), boletoId: boletoId.trim(), matricula: matricula.trim(), status, value, date: date.trim() })
  }

  return records
}
