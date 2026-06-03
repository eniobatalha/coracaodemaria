"use client"

import { useState, useEffect, useRef } from "react"
import {
  Check, CheckCircle2, AlertTriangle, Upload, FileText,
  Landmark, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react"
import {
  loadAllBoletos, saveAllBoletos, getDebtors,
  parseCnab, DEMO_CNAB,
  type BoletoFull, type CnabRecord,
} from "@/lib/portal-funcionario/secretaria-data"
import { MOCK_GUARDIANS } from "@/lib/portal/mock-data"

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
function formatDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

type ImportStep = "idle" | "preview" | "done"

export default function FinanceiroPage() {
  const [boletos,       setBoletos]       = useState<BoletoFull[]>([])
  const [cnabText,      setCnabText]      = useState("")
  const [step,          setStep]          = useState<ImportStep>("idle")
  const [parsed,        setParsed]        = useState<CnabRecord[]>([])
  const [applied,       setApplied]       = useState<string[]>([])     // boleto IDs marked Pago
  const [expandDebtor,  setExpandDebtor]  = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setBoletos(loadAllBoletos()) }, [])

  const debtors = getDebtors(boletos)
  const paidAll = boletos.filter((b) => b.status === "Pago")
  const pending = boletos.filter((b) => b.status !== "Pago")

  // ── File upload handling ────────────────────────────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCnabText(ev.target?.result as string ?? "")
    reader.readAsText(file, "latin1")
  }

  function handleLoadDemo() {
    setCnabText(DEMO_CNAB)
  }

  function handlePreview() {
    const records = parseCnab(cnabText)
    setParsed(records)
    setStep("preview")
  }

  function handleApply() {
    const updatedIds: string[] = []
    const updatedBoletos = boletos.map((b) => {
      const match = parsed.find((r) => r.boletoId === b.id && r.status === "PAGO")
      if (match) { updatedIds.push(b.id); return { ...b, status: "Pago" as const } }
      return b
    })
    setBoletos(updatedBoletos)
    saveAllBoletos(updatedBoletos)
    setApplied(updatedIds)
    setStep("done")
    setParsed([])
    setCnabText("")
  }

  function handleReset() {
    setStep("idle")
    setParsed([])
    setApplied([])
    setCnabText("")
  }

  // Map boletoId → student name for preview table
  const boletoMap = new Map(boletos.map((b) => [b.id, b]))

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#071D5B]">Financeiro</h1>
        <p className="mt-1 text-sm text-slate-500">Importação de arquivo de retorno bancário e gestão de cobranças</p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10 text-center">
          <p className="text-2xl font-black text-[#C71F2D]">{debtors.length}</p>
          <p className="text-xs font-bold text-slate-500">Devedores</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10 text-center">
          <p className="text-2xl font-black text-amber-600">{pending.length}</p>
          <p className="text-xs font-bold text-slate-500">Pendentes</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#C71F2D]/10 text-center">
          <p className="text-2xl font-black text-green-600">{paidAll.length}</p>
          <p className="text-xs font-bold text-slate-500">Baixados</p>
        </div>
      </div>

      {/* ── Import section ── */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
        <div className="mb-4 flex items-center gap-2">
          <Landmark size={20} className="text-[#C71F2D]" />
          <h2 className="font-black text-[#071D5B]">Importar Arquivo de Retorno</h2>
        </div>

        {step === "idle" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Faça upload do arquivo de retorno bancário (CNAB) para atualizar automaticamente
              os títulos baixados e identificar quais responsáveis quitaram seus débitos.
            </p>

            {/* File upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 py-8 text-center hover:border-[#C71F2D] hover:bg-[#FFF5F5] transition">
              <Upload size={28} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-bold text-slate-500">Clique para selecionar o arquivo .ret / .txt</p>
              <p className="text-xs text-slate-400">Formatos aceitos: CNAB 400, CNAB 240</p>
              <input ref={fileRef} type="file" accept=".ret,.txt,.csv,.rem" className="hidden"
                onChange={handleFile} />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-bold text-slate-400">ou</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Demo file */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="mb-2 text-xs font-bold text-slate-500">Arquivo demo (para teste):</p>
              <pre className="mb-3 overflow-x-auto rounded-lg bg-white p-3 text-[11px] text-slate-600 ring-1 ring-slate-200 font-mono whitespace-pre">
                {DEMO_CNAB}
              </pre>
              <button onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-300 transition">
                <FileText size={14} /> Carregar arquivo demo
              </button>
            </div>

            {cnabText && (
              <div className="rounded-xl bg-[#FFF5F5] p-3">
                <p className="mb-1 text-xs font-bold text-[#C71F2D]">Arquivo carregado — {cnabText.split("\n").length} linhas</p>
                <pre className="overflow-x-auto text-[10px] text-slate-600 font-mono whitespace-pre max-h-32 overflow-y-auto">{cnabText}</pre>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={handlePreview} disabled={!cnabText}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-5 py-2.5 text-sm font-black text-white hover:bg-[#a81826] disabled:opacity-40 transition">
                <FileText size={16} /> Processar Arquivo
              </button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div>
            <p className="mb-4 text-sm font-bold text-slate-600">
              {parsed.length} registro{parsed.length !== 1 ? "s" : ""} encontrado{parsed.length !== 1 ? "s" : ""} no arquivo. Revise e confirme a baixa.
            </p>
            <div className="mb-4 overflow-x-auto rounded-xl ring-1 ring-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wide text-slate-500">Seq</th>
                    <th className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wide text-slate-500">Aluno</th>
                    <th className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wide text-slate-500">Título</th>
                    <th className="px-4 py-2.5 text-right text-xs font-black uppercase tracking-wide text-slate-500">Valor</th>
                    <th className="px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r) => {
                    const boleto = boletoMap.get(r.boletoId)
                    return (
                      <tr key={r.seq} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-2.5 text-xs text-slate-400 font-mono">{r.seq}</td>
                        <td className="px-4 py-2.5 text-sm font-bold text-[#071D5B]">
                          {boleto?.studentName ?? "—"} {boleto && <span className="text-xs font-normal text-slate-400">({r.matricula})</span>}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-600">{boleto?.title ?? r.boletoId}</td>
                        <td className="px-4 py-2.5 text-right text-sm font-black text-[#071D5B]">{formatBRL(r.value)}</td>
                        <td className="px-4 py-2.5 text-center">
                          {r.status === "PAGO" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-black text-green-700">
                              <Check size={11} /> Pago em {r.date}
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700">Rejeitado</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <button onClick={handleApply}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-black text-white hover:bg-green-700">
                <CheckCircle2 size={16} /> Confirmar e Aplicar Baixas
              </button>
              <button onClick={handleReset}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div>
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
              <CheckCircle2 size={24} className="shrink-0 text-green-600" />
              <div>
                <p className="font-black text-green-800">{applied.length} título{applied.length !== 1 ? "s" : ""} baixado{applied.length !== 1 ? "s" : ""} com sucesso!</p>
                <p className="text-sm text-green-600">O sistema foi atualizado. Veja abaixo a situação atual dos responsáveis.</p>
              </div>
            </div>

            {/* Freed from debt */}
            {(() => {
              const newDebtors = getDebtors(boletos)
              const cleared = applied
                .map((id) => boletoMap.get(id))
                .filter(Boolean)
                .map((b) => b!.studentName)
                .filter((name, i, arr) => {
                  const studentId = boletos.find((b) => b.studentName === name)?.studentId
                  if (!studentId) return false
                  return !newDebtors.find((d) => d.studentId === studentId)
                })
                .filter((v, i, a) => a.indexOf(v) === i)

              if (cleared.length > 0) {
                return (
                  <div className="mb-4 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200">
                    <p className="mb-1 text-sm font-black text-blue-800">Responsáveis que quitaram todos os débitos:</p>
                    <ul className="text-sm text-blue-700 list-disc list-inside">
                      {cleared.map((name) => <li key={name}>{name}</li>)}
                    </ul>
                    <p className="mt-2 text-xs text-blue-600">Esses responsáveis não precisam mais ser notificados sobre dívidas.</p>
                  </div>
                )
              }
              return null
            })()}

            <button onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#C71F2D] px-4 py-2 text-sm font-black text-[#C71F2D] hover:bg-[#C71F2D] hover:text-white transition">
              <RefreshCw size={15} /> Nova importação
            </button>
          </div>
        )}
      </div>

      {/* ── Debtors list ── */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-400">Situação dos Responsáveis</h2>
      {debtors.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
          <CheckCircle2 size={28} className="mx-auto mb-2 text-green-500" />
          <p className="font-black text-green-700">Todos os responsáveis estão em dia!</p>
          <p className="mt-1 text-xs text-slate-500">Nenhum débito pendente ou vencido no momento.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {debtors.map((d) => {
            const guardian = MOCK_GUARDIANS[d.guardianId]
            const isExpanded = expandDebtor === d.studentId
            return (
              <div key={d.studentId} className={`rounded-2xl bg-white shadow-sm ring-1 overflow-hidden ${
                d.hasOverdue ? "ring-red-200" : "ring-[#C71F2D]/10"
              }`}>
                <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50 transition"
                  onClick={() => setExpandDebtor(isExpanded ? null : d.studentId)}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-sm font-black text-[#C71F2D]">
                    {getInitials(d.studentName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#071D5B]">{d.studentName}</p>
                    <p className="text-xs text-slate-500">
                      {guardian ? `Resp.: ${guardian.name.split(" ")[0]} ${guardian.name.split(" ").slice(-1)[0]}` : ""}
                      {" · "}Mat. {d.matricula.padStart(6, "0")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right mr-2">
                    <p className="font-black text-[#C71F2D]">{formatBRL(d.totalOwed)}</p>
                    {d.hasOverdue && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500">
                        <AlertTriangle size={10} /> Vencido
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="shrink-0 text-slate-400" /> : <ChevronDown size={16} className="shrink-0 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 pb-3">
                    {d.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-[#071D5B]">{item.title}</p>
                          <p className="text-xs text-slate-400">Vence: {formatDate(item.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-[#071D5B]">{formatBRL(item.value)}</p>
                          <span className={`text-xs font-bold ${item.status === "Vencido" ? "text-red-500" : "text-amber-600"}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
