"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Plus, Send, Trash2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react"
import { comunicadosApi, type Comunicado } from "@/lib/api/comunicados"

const TARGETS = [
  { value: "all",       label: "Todos os alunos"          },
  { value: "gaibu",     label: "Unidade Gaibu"             },
  { value: "cabo",      label: "Unidade Cabo"              },
  { value: "1a-manha",  label: "1º Ano A — Manhã (Gaibu)"  },
  { value: "1b-tarde",  label: "1º Ano B — Tarde (Gaibu)"  },
  { value: "4a",        label: "4º Ano A — Manhã (Cabo)"   },
] as const

const BLANK = {
  titulo:             "",
  conteudo:           "",
  urgente:            false,
  destinatario:       "all",
  destinatario_label: "Todos os alunos",
}

function formatDate(iso: string) {
  const d = iso.slice(0, 10)
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

export default function ComunicadosPage() {
  const [notices, setNotices] = useState<Comunicado[]>([])
  const [form,    setForm]    = useState(BLANK)
  const [adding,  setAdding]  = useState(false)
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    comunicadosApi.listar()
      .then(r => setNotices(r.comunicados))
      .catch(err => setError(err.message ?? "Erro ao carregar comunicados"))
      .finally(() => setLoading(false))
  }, [])

  function handleTargetChange(value: string) {
    const label = TARGETS.find(t => t.value === value)?.label ?? value
    setForm(f => ({ ...f, destinatario: value, destinatario_label: label }))
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.conteudo.trim()) return
    try {
      const res = await comunicadosApi.criar({
        titulo:             form.titulo.trim(),
        conteudo:           form.conteudo.trim(),
        urgente:            form.urgente,
        destinatario:       form.destinatario,
        destinatario_label: form.destinatario_label,
      })
      setNotices(prev => [res.comunicado, ...prev])
      setForm(BLANK)
      setAdding(false)
      setSent(true)
      setTimeout(() => setSent(false), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao publicar comunicado"
      setError(msg)
      setTimeout(() => setError(null), 5000)
    }
  }

  async function handleDelete(id: number) {
    try {
      await comunicadosApi.excluir(id)
      setNotices(prev => prev.filter(n => n.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover comunicado"
      setError(msg)
      setTimeout(() => setError(null), 5000)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#071D5B]">Comunicados</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Carregando..."
              : `${notices.length} comunicado${notices.length !== 1 ? "s" : ""} publicado${notices.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {!adding && !loading && (
          <button onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2.5 text-sm font-black text-white hover:bg-[#a81826]">
            <Plus size={16} /> Novo Comunicado
          </button>
        )}
      </div>

      {/* Feedback */}
      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 ring-1 ring-slate-200">
          <Loader2 size={16} className="animate-spin" /> Carregando comunicados...
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {sent && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check size={16} /> Comunicado publicado e enviado para os responsáveis!
        </div>
      )}

      {/* New notice form */}
      {adding && (
        <form onSubmit={handlePublish}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#C71F2D]/10">
          <h3 className="mb-4 font-black text-[#071D5B]">Novo Comunicado</h3>
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#071D5B]">Destinatários</label>
                <select value={form.destinatario}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm font-bold text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20">
                  {TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-[#FFF5F5] px-4 py-2.5 w-full hover:bg-[#FFE8E8] transition">
                  <input type="checkbox" checked={form.urgente}
                    onChange={(e) => setForm((f) => ({ ...f, urgente: e.target.checked }))}
                    className="h-4 w-4 accent-[#C71F2D]" />
                  <span className="text-sm font-bold text-[#071D5B] flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-[#C71F2D]" />
                    Comunicado urgente
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Título</label>
              <input type="text" value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Título do comunicado..."
                className="w-full rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#071D5B]">Mensagem</label>
              <textarea rows={4} value={form.conteudo}
                onChange={(e) => setForm((f) => ({ ...f, conteudo: e.target.value }))}
                placeholder="Escreva a mensagem completa do comunicado..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-[#FFF5F5] px-3 py-2 text-sm text-[#071D5B] outline-none focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/20" />
            </div>
            <div className="flex gap-2">
              <button type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C71F2D] px-4 py-2 text-sm font-black text-white hover:bg-[#a81826]">
                <Send size={15} /> Publicar Comunicado
              </button>
              <button type="button" onClick={() => setAdding(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notices list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {notices.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-[#C71F2D]/10">
              <Bell size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-400">Nenhum comunicado publicado ainda.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice.id}
                className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ${
                  notice.urgente ? "ring-red-200 border-l-4 border-[#C71F2D]" : "ring-[#C71F2D]/10"
                }`}>
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.urgente && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700">
                        <AlertTriangle size={11} /> Urgente
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                      {notice.destinatario_label}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(notice.criado_em)}</span>
                  </div>
                  <button onClick={() => handleDelete(notice.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="font-black text-[#071D5B]">{notice.titulo}</p>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{notice.conteudo}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
