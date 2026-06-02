"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Download,
  QrCode,
  WalletCards,
  X,
} from "lucide-react"
import { MOCK_STUDENTS, MOCK_BOLETOS } from "@/lib/portal/mock-data"
import type { Boleto } from "@/lib/portal/types"

async function copyText(text: string) {
  if (navigator?.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return } catch {}
  }
  const el = document.createElement("textarea")
  el.value = text
  el.style.cssText = "position:fixed;opacity:0;pointer-events:none"
  document.body.appendChild(el)
  el.focus(); el.select()
  try { document.execCommand("copy") } catch {}
  document.body.removeChild(el)
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function statusStyle(status: Boleto["status"]) {
  if (status === "Pago")     return { bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircle2,  label: "Pago" }
  if (status === "Vencido")  return { bg: "bg-red-100",    text: "text-[#E4252A]",  icon: AlertCircle,   label: "Vencido" }
  return                            { bg: "bg-amber-100",  text: "text-amber-700",  icon: AlertCircle,   label: "A vencer" }
}

function PixModal({ boleto, onClose }: { boleto: Boleto; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copyKey() {
    await copyText(boleto.pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#071D5B]">Pagar via Pix</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-[#F0F4FF] p-4 text-center">
          <QrCode size={64} className="mx-auto mb-2 text-[#071D5B]/30" />
          <p className="text-xs text-slate-400">QR Code gerado na integração bancária</p>
        </div>

        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Chave Pix</p>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
          <span className="flex-1 truncate text-sm font-bold text-[#071D5B]">{boleto.pixKey}</span>
          <button onClick={copyKey}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
              copied ? "bg-green-500 text-white" : "bg-white text-[#071D5B] hover:bg-slate-200"}`}>
            {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
          </button>
        </div>
        {copied && <p className="mt-1 text-center text-xs font-bold text-green-600">Chave copiada!</p>}

        <div className="mt-4 rounded-xl bg-[#071D5B]/5 p-3 text-center">
          <p className="text-xs text-slate-500">Valor a pagar</p>
          <p className="text-2xl font-black text-[#071D5B]">{formatBRL(boleto.value)}</p>
          <p className="text-xs text-slate-400">Venc. {formatDate(boleto.dueDate)}</p>
        </div>
      </div>
    </div>
  )
}

function downloadBoleto(boleto: Boleto, studentName: string) {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Boleto — ${boleto.title}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#071D5B;background:#fff}
  .header{border-bottom:3px solid #071D5B;padding-bottom:12px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between}
  h1{font-size:18px;margin:0}
  .badge{background:#071D5B;color:#fff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:bold}
  .row{display:flex;gap:24px;margin-bottom:12px}
  .field{flex:1}
  .label{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#888;font-weight:bold}
  .value{font-size:14px;font-weight:bold;margin-top:2px}
  .amount{font-size:28px;font-weight:900;color:#E4252A}
  .barcode{background:#f5f5f5;border-radius:8px;padding:12px;margin-top:16px;font-family:monospace;font-size:13px;letter-spacing:.05em;word-break:break-all}
  .footer{margin-top:24px;border-top:1px solid #ddd;padding-top:12px;font-size:11px;color:#888;text-align:center}
  @media print{body{padding:0}}
</style>
</head>
<body>
<div class="header">
  <div>
    <div style="font-size:11px;font-weight:bold;color:#888">COLÉGIO E CURSO</div>
    <h1>CORAÇÃO DE MARIA</h1>
  </div>
  <span class="badge">BOLETO DE COBRANÇA</span>
</div>
<div class="row">
  <div class="field"><div class="label">Aluno</div><div class="value">${studentName}</div></div>
  <div class="field"><div class="label">Referência</div><div class="value">${boleto.title}</div></div>
</div>
<div class="row">
  <div class="field"><div class="label">Vencimento</div><div class="value">${formatDate(boleto.dueDate)}</div></div>
  <div class="field"><div class="label">Valor</div><div class="amount">${formatBRL(boleto.value)}</div></div>
</div>
<div class="field" style="margin-bottom:8px"><div class="label">Descrição</div><div class="value" style="font-weight:normal">${boleto.description}</div></div>
<div class="label" style="margin-top:16px">Linha Digitável</div>
<div class="barcode">${boleto.barcode}</div>
<div class="footer">Colégio e Curso Coração de Maria · financeiro@coracaodemaria.edu.br<br/>Este boleto é gerado automaticamente — integração bancária em implementação.</div>
<script>window.onload=()=>window.print()</script>
</body>
</html>`

  const win = window.open("", "_blank")
  if (win) { win.document.write(html); win.document.close() }
}

export default function FinanceiroPage() {
  const params    = useParams()
  const studentId = params.id as string
  const student   = MOCK_STUDENTS.find((s) => s.id === studentId)
  const boletos   = MOCK_BOLETOS[studentId] ?? []
  const [pixBoleto,  setPixBoleto]  = useState<Boleto | null>(null)
  const [copiedId,   setCopiedId]   = useState<string | null>(null)

  if (!student) return null

  const pending  = boletos.filter((b) => b.status !== "Pago")
  const totalPending = pending.reduce((s, b) => s + b.value, 0)
  const vencido  = pending.filter((b) => b.status === "Vencido")

  async function copyBarcode(boleto: Boleto) {
    await copyText(boleto.barcode)
    setCopiedId(boleto.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071D5B]/10 text-[#071D5B]">
          <WalletCards size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Financeiro</h1>
          <p className="text-sm text-slate-500">Mensalidades e cobranças</p>
        </div>
      </div>

      {/* Summary */}
      {pending.length > 0 && (
        <div className={`mb-5 rounded-2xl p-4 shadow-sm ${vencido.length > 0 ? "bg-red-50" : "bg-amber-50"}`}>
          <p className={`text-xs font-bold uppercase tracking-wide ${vencido.length > 0 ? "text-[#E4252A]" : "text-amber-700"}`}>
            {vencido.length > 0 ? "⚠️ Há cobranças vencidas" : "Cobranças em aberto"}
          </p>
          <p className={`mt-1 text-3xl font-black ${vencido.length > 0 ? "text-[#E4252A]" : "text-amber-800"}`}>
            {formatBRL(totalPending)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{pending.length} cobrança{pending.length > 1 ? "s" : ""} pendente{pending.length > 1 ? "s" : ""}</p>
        </div>
      )}

      {/* Boleto list */}
      <div className="flex flex-col gap-3">
        {boletos.map((boleto) => {
          const style   = statusStyle(boleto.status)
          const StatusIcon = style.icon
          const isPending  = boleto.status !== "Pago"

          return (
            <article key={boleto.id} className={`rounded-2xl bg-white p-4 shadow-sm ${boleto.status === "Vencido" ? "border border-red-100" : ""}`}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-black text-[#071D5B]">{boleto.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{boleto.description}</p>
                </div>
                <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.bg} ${style.text}`}>
                  <StatusIcon size={12} />
                  {style.label}
                </span>
              </div>

              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400">Vencimento</p>
                  <p className="font-bold text-[#071D5B]">{formatDate(boleto.dueDate)}</p>
                </div>
                <p className="text-2xl font-black text-[#071D5B]">{formatBRL(boleto.value)}</p>
              </div>

              {isPending && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copyBarcode(boleto)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                      copiedId === boleto.id
                        ? "bg-green-500 text-white"
                        : "bg-[#F0F4FF] text-[#071D5B] hover:bg-[#0057D9]/10"
                    }`}>
                    {copiedId === boleto.id ? <Check size={16} /> : <ClipboardCopy size={16} />}
                    {copiedId === boleto.id ? "Copiado!" : "Cód. barras"}
                  </button>

                  <button onClick={() => setPixBoleto(boleto)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F0F4FF] px-3 py-2.5 text-sm font-bold text-[#071D5B] transition hover:bg-[#0057D9]/10">
                    <QrCode size={16} />
                    Pix
                  </button>

                  <button onClick={() => downloadBoleto(boleto, student.name)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#071D5B] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a2a80]">
                    <Download size={16} />
                    Boleto
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {pixBoleto && <PixModal boleto={pixBoleto} onClose={() => setPixBoleto(null)} />}
    </div>
  )
}
