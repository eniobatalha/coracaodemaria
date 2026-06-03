// All financial and operational data for the director's dashboard — fully mocked.
// Real integrations (ERP, payment gateway) will replace these in production.

export type MonthlyFinancial = {
  month: string
  receita: number
  despesas: number
  resultado: number
  adimplencia: number   // % dos alunos que pagaram
}

export type ExpenseCategory = {
  name: string
  value: number
  color: string
}

export type Debtor = {
  id: string
  studentName: string
  guardianName: string
  unit: "Cabo" | "Gaibu"
  totalOwed: number
  monthsDelay: number
  lastPayment: string
  isOverdue: boolean
}

export type EnrollmentByUnit = {
  unit: string
  count: number
  capacity: number
  color: string
}

export type MonthlyReceivable = {
  label: string
  value: number
  color: string
}

export type GradeDistribution = {
  label: string
  short: string
  count: number
  color: string
}

export type NewVsCanceled = {
  month: string
  novas: number
  canceladas: number
}

// ─── Monthly financials (Jan–Jun 2026) ────────────────────────────────────────
export const MONTHLY_FINANCIALS: MonthlyFinancial[] = [
  { month: "Jan", receita: 118_200, despesas:  91_500, resultado: 26_700, adimplencia: 96.1 },
  { month: "Fev", receita: 115_800, despesas:  89_700, resultado: 26_100, adimplencia: 95.3 },
  { month: "Mar", receita: 119_600, despesas:  93_200, resultado: 26_400, adimplencia: 96.8 },
  { month: "Abr", receita: 120_900, despesas:  92_800, resultado: 28_100, adimplencia: 97.2 },
  { month: "Mai", receita: 122_400, despesas:  95_100, resultado: 27_300, adimplencia: 96.5 },
  { month: "Jun", receita:  98_350, despesas:  78_500, resultado: 19_850, adimplencia: 80.6 }, // partial month
]

// ─── Expense breakdown (June) ─────────────────────────────────────────────────
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: "Folha de pagamento", value: 47_100, color: "#4A0010" },
  { name: "Aluguel",            value: 11_775, color: "#C71F2D" },
  { name: "Material pedagógico", value: 7_850, color: "#f59e0b" },
  { name: "Manutenção",         value:  6_280, color: "#6366f1" },
  { name: "Outros",             value:  5_495, color: "#94a3b8" },
]

// ─── Receivables status (June) ────────────────────────────────────────────────
export const RECEIVABLES: MonthlyReceivable[] = [
  { label: "Recebido",  value: 98_350, color: "#22c55e" },
  { label: "A vencer",  value: 16_450, color: "#f59e0b" },
  { label: "Vencido",   value:  7_150, color: "#C71F2D" },
]

// ─── Enrollment by unit ───────────────────────────────────────────────────────
export const ENROLLMENT_BY_UNIT: EnrollmentByUnit[] = [
  { unit: "Cabo",  count: 87, capacity: 120, color: "#071D5B" },
  { unit: "Gaibu", count: 64, capacity:  80, color: "#C71F2D" },
]

// ─── Grade distribution (1º Ano — Profª Luana Marcela) ───────────────────────
export const GRADE_DISTRIBUTION: GradeDistribution[] = [
  { label: "Muito Bom (MB)", short: "MB", count: 28, color: "#22c55e" },
  { label: "Bom (B)",        short: "B",  count: 14, color: "#f59e0b" },
  { label: "Regular (R)",    short: "R",  count:  3, color: "#C71F2D" },
]

// ─── New enrollments vs cancellations ────────────────────────────────────────
export const ENROLLMENT_TREND: NewVsCanceled[] = [
  { month: "Jan", novas: 8, canceladas: 2 },
  { month: "Fev", novas: 3, canceladas: 1 },
  { month: "Mar", novas: 2, canceladas: 0 },
  { month: "Abr", novas: 1, canceladas: 2 },
  { month: "Mai", novas: 4, canceladas: 1 },
  { month: "Jun", novas: 3, canceladas: 1 },
]

// ─── Top debtors ──────────────────────────────────────────────────────────────
export const DEBTORS: Debtor[] = [
  {
    id: "d1", studentName: "João Rodrigues",    guardianName: "Família Rodrigues",
    unit: "Cabo",  totalOwed: 2_550, monthsDelay: 3, lastPayment: "2026-03-10", isOverdue: true,
  },
  {
    id: "d2", studentName: "Ana Mendes",        guardianName: "Família Mendes",
    unit: "Gaibu", totalOwed: 1_500, monthsDelay: 2, lastPayment: "2026-04-08", isOverdue: true,
  },
  {
    id: "d3", studentName: "Carlos Oliveira",   guardianName: "Família Oliveira",
    unit: "Cabo",  totalOwed: 1_700, monthsDelay: 2, lastPayment: "2026-04-12", isOverdue: true,
  },
  {
    id: "d4", studentName: "Maria Santos",      guardianName: "Família Santos",
    unit: "Cabo",  totalOwed:   850, monthsDelay: 1, lastPayment: "2026-05-10", isOverdue: false,
  },
  {
    id: "d5", studentName: "Pedro Lima",        guardianName: "Família Lima",
    unit: "Gaibu", totalOwed:   750, monthsDelay: 1, lastPayment: "2026-05-08", isOverdue: false,
  },
  {
    id: "d6", studentName: "Hera Barbosa Batalha", guardianName: "Família Batalha",
    unit: "Gaibu", totalOwed:   750, monthsDelay: 1, lastPayment: "2026-05-09", isOverdue: false,
  },
  {
    id: "d7", studentName: "Dionísio Barbosa Batalha", guardianName: "Família Batalha",
    unit: "Cabo",  totalOwed: 1_170, monthsDelay: 1, lastPayment: "2026-05-10", isOverdue: true,
  },
]

// ─── KPI summary helpers ──────────────────────────────────────────────────────
export const CURRENT_MONTH = MONTHLY_FINANCIALS[MONTHLY_FINANCIALS.length - 1]
export const PREVIOUS_MONTH = MONTHLY_FINANCIALS[MONTHLY_FINANCIALS.length - 2]

export const TOTAL_STUDENTS = ENROLLMENT_BY_UNIT.reduce((s, u) => s + u.count, 0)
export const TOTAL_STAFF    = 28  // teachers + admin + support
export const TOTAL_EVENTS   = 6   // upcoming school events
export const TOTAL_EXPECTED_JUNE = RECEIVABLES.reduce((s, r) => s + r.value, 0)
export const OVERDUE_COUNT  = DEBTORS.filter((d) => d.isOverdue).length
export const TOTAL_OWED     = DEBTORS.reduce((s, d) => s + d.totalOwed, 0)

export function pct(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}
