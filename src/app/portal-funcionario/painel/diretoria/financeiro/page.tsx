"use client"

import { useState } from "react"
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { AlertTriangle, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react"
import {
  MONTHLY_FINANCIALS,
  EXPENSE_CATEGORIES,
  RECEIVABLES,
  ENROLLMENT_BY_UNIT,
  GRADE_DISTRIBUTION,
  ENROLLMENT_TREND,
  DEBTORS,
  CURRENT_MONTH,
  PREVIOUS_MONTH,
  TOTAL_STUDENTS,
  TOTAL_EXPECTED_JUNE,
  OVERDUE_COUNT,
  TOTAL_OWED,
  pct,
} from "@/lib/portal-funcionario/diretoria-data"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}
function brlK(v: number) {
  return v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : brl(v)
}
function diff(curr: number, prev: number) {
  const d = curr - prev
  const pct = prev === 0 ? 0 : Math.round((d / prev) * 100)
  return { d, pct, up: d >= 0 }
}

// ─── Tooltip customisations ───────────────────────────────────────────────────
function BrlTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200 text-xs">
      <p className="mb-1 font-black text-slate-600">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {brl(p.value)}
        </p>
      ))}
    </div>
  )
}

function PctTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200 text-xs">
      <p className="font-black text-slate-600">{label}</p>
      <p className="font-bold text-[#071D5B]">{payload[0].value}% adimplência</p>
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, trend, color = "text-[#071D5B]",
}: {
  label: string; value: string | number; sub?: string; trend?: { pct: number; up: boolean }; color?: string
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${color}`}>{typeof value === "number" ? brl(value) : value}</p>
      <div className="mt-1 flex items-center gap-2">
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${trend.up ? "text-green-600" : "text-red-500"}`}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend.pct)}% vs mês ant.
          </span>
        )}
        {sub && <span className="text-xs text-slate-400">{sub}</span>}
      </div>
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">{children}</h2>
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10 ${className}`}>
      <p className="mb-3 font-black text-[#071D5B]">{title}</p>
      {children}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DiretoriaFinanceiroPage() {
  const [period,        setPeriod]        = useState<"6m" | "ytd">("6m")
  const [expandDebtor,  setExpandDebtor]  = useState<string | null>(null)

  const periodData = period === "ytd" ? MONTHLY_FINANCIALS : MONTHLY_FINANCIALS.slice(-6)
  const receitaDiff  = diff(CURRENT_MONTH.receita,   PREVIOUS_MONTH.receita)
  const despesasDiff = diff(CURRENT_MONTH.despesas,  PREVIOUS_MONTH.despesas)
  const resultDiff   = diff(CURRENT_MONTH.resultado, PREVIOUS_MONTH.resultado)
  const adimplPct    = CURRENT_MONTH.adimplencia

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">Dashboard Financeiro</h1>
          <p className="mt-1 text-sm text-slate-500">Dados de Janeiro a Junho de 2026 · Dados mockados</p>
        </div>
        <div className="flex rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {(["6m", "ytd"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-black transition ${
                period === p ? "bg-[#4A0010] text-white" : "text-slate-500 hover:bg-slate-50"
              }`}>
              {p === "6m" ? "Últimos 6 meses" : "Ano completo"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Receita (Jun)"   value={CURRENT_MONTH.receita}          trend={receitaDiff}  color="text-green-600" />
        <KpiCard label="Despesas (Jun)"  value={CURRENT_MONTH.despesas}         trend={{ pct: despesasDiff.pct, up: !despesasDiff.up }} color="text-[#C71F2D]" />
        <KpiCard label="Resultado (Jun)" value={CURRENT_MONTH.resultado}        trend={resultDiff}   color="text-blue-600" />
        <KpiCard label="A receber"       value={TOTAL_EXPECTED_JUNE - CURRENT_MONTH.receita} sub="títulos abertos" color="text-amber-600" />
        <KpiCard label="Adimplência"     value={`${adimplPct}%`}               sub={`${TOTAL_STUDENTS} alunos`} color={adimplPct >= 90 ? "text-green-600" : "text-amber-600"} />
      </div>

      {/* Revenue vs Expenses bar chart */}
      <ChartCard title="Receita vs Despesas">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="h-3 w-3 rounded-full bg-[#22c55e]" />Receita</div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="h-3 w-3 rounded-full bg-[#C71F2D]" />Despesas</div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="h-3 w-3 rounded-full bg-[#0057D9]" />Resultado</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={periodData} barGap={2} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={brlK} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<BrlTooltip />} />
            <Bar dataKey="receita"   name="Receita"   fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas"  name="Despesas"  fill="#C71F2D" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resultado" name="Resultado" fill="#0057D9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Adimplência trend + Enrollment trend */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Adimplência Mensal (%)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={periodData}>
              <defs>
                <linearGradient id="adimplGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0057D9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0057D9" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<PctTooltip />} />
              <Area type="monotone" dataKey="adimplencia" name="Adimplência" stroke="#0057D9" strokeWidth={2.5} fill="url(#adimplGrad)" dot={{ r: 4, fill: "#0057D9" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Matrículas Novas vs Cancelamentos">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ENROLLMENT_TREND} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip />
              <Bar dataKey="novas"      name="Novas"        fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="canceladas" name="Cancelamentos" fill="#C71F2D" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pie charts row */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Receivables */}
        <ChartCard title="Recebimentos — Junho">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={RECEIVABLES} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={70}
                paddingAngle={3} strokeWidth={0}>
                {RECEIVABLES.map((r) => <Cell key={r.label} fill={r.color} />)}
              </Pie>
              <Tooltip formatter={(v) => brl(Number(v ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 space-y-1">
            {RECEIVABLES.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-bold text-slate-600">{r.label}</span>
                </div>
                <span className="font-black text-[#071D5B]">{brl(r.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Expense breakdown */}
        <ChartCard title="Despesas por Categoria (Jun)">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={EXPENSE_CATEGORIES} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={70}
                paddingAngle={3} strokeWidth={0}>
                {EXPENSE_CATEGORIES.map((c) => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v) => brl(Number(v ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 space-y-1">
            {EXPENSE_CATEGORIES.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="truncate font-bold text-slate-600">{c.name}</span>
                </div>
                <span className="ml-1 shrink-0 font-black text-[#071D5B]">{pct(c.value, CURRENT_MONTH.despesas)}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Enrollment + Grade distribution */}
        <div className="flex flex-col gap-4">
          <ChartCard title="Alunos por Unidade">
            <div className="space-y-3">
              {ENROLLMENT_BY_UNIT.map((u) => (
                <div key={u.unit}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-black text-[#071D5B]">{u.unit}</span>
                    <span className="font-bold text-slate-500">{u.count}/{u.capacity}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct(u.count, u.capacity)}%`, backgroundColor: u.color }} />
                  </div>
                  <p className="mt-0.5 text-right text-[10px] text-slate-400">{pct(u.count, u.capacity)}% de ocupação</p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Desempenho Acadêmico (1º Ano)">
            <div className="space-y-2">
              {GRADE_DISTRIBUTION.map((g) => (
                <div key={g.short}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-black text-[#071D5B]">{g.short}</span>
                    <span className="font-bold text-slate-500">{g.count} alunos</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${pct(g.count, 45)}%`, backgroundColor: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Debtors table */}
      <div>
        <SectionTitle>
          Responsáveis com Atraso ({DEBTORS.length}) — Total: {brl(TOTAL_OWED)}
        </SectionTitle>
        <div className="flex flex-col gap-2">
          {DEBTORS.map((d) => (
            <div key={d.id} className={`rounded-2xl bg-white shadow-sm ring-1 overflow-hidden ${
              d.isOverdue ? "ring-red-200" : "ring-[#C71F2D]/10"
            }`}>
              <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50 transition"
                onClick={() => setExpandDebtor(expandDebtor === d.id ? null : d.id)}>
                {/* Unit badge */}
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                  d.unit === "Cabo" ? "bg-[#071D5B]/10 text-[#071D5B]" : "bg-[#C71F2D]/10 text-[#C71F2D]"
                }`}>{d.unit}</span>

                <div className="min-w-0 flex-1">
                  <p className="font-black text-[#071D5B]">{d.guardianName}</p>
                  <p className="text-xs text-slate-500">
                    {d.studentName} · {d.monthsDelay} mes{d.monthsDelay !== 1 ? "es" : ""} em atraso · ult. pag. {d.lastPayment}
                  </p>
                </div>

                <div className="shrink-0 text-right mr-2">
                  <p className="font-black text-[#C71F2D]">{brl(d.totalOwed)}</p>
                  {d.isOverdue && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500">
                      <AlertTriangle size={10} /> Vencido
                    </span>
                  )}
                </div>

                {expandDebtor === d.id
                  ? <ChevronUp size={15} className="shrink-0 text-slate-400" />
                  : <ChevronDown size={15} className="shrink-0 text-slate-400" />
                }
              </button>

              {expandDebtor === d.id && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 text-sm">
                  <p className="text-xs font-black text-slate-500 mb-2">Detalhamento dos débitos</p>
                  {Array.from({ length: d.monthsDelay }, (_, i) => {
                    const monthOffset = 5 - i
                    const months = ["Jan","Fev","Mar","Abr","Mai","Jun"]
                    const monthLabel = months[monthOffset] ?? `M${i+1}`
                    const fee = d.unit === "Cabo" ? 850 : 750
                    return (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                        <p className="font-bold text-[#071D5B]">Mensalidade — {monthLabel}/2026</p>
                        <div className="text-right">
                          <p className="font-black text-[#071D5B]">{brl(fee)}</p>
                          <span className={`text-[10px] font-bold ${i === 0 ? "text-amber-600" : "text-red-500"}`}>
                            {i === 0 ? "A vencer" : "Vencido"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resultado acumulado line chart */}
      <ChartCard title="Resultado Acumulado no Ano">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={(() => {
            let acc = 0
            return periodData.map((m) => ({ month: m.month, acumulado: (acc += m.resultado) }))
          })()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={brlK} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
            <Tooltip formatter={(v) => brl(Number(v ?? 0))} labelStyle={{ fontWeight: 700, color: "#334155" }} />
            <Line type="monotone" dataKey="acumulado" name="Acumulado" stroke="#0057D9" strokeWidth={2.5}
              dot={{ r: 5, fill: "#0057D9", strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  )
}
