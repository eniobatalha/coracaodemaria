"use client"

import { useState, useEffect, useCallback } from "react"
import {
  BookOpen, ChevronRight, Clock, GraduationCap, KeyRound,
  Mail, MapPin, Pencil, Plus, School, Trash2, User, Users, X,
} from "lucide-react"
import {
  professoresApi, turmasApi, alunosApi, responsaveisApi,
  type Professor, type Turma, type Aluno, type Responsavel,
} from "@/lib/api/cadastros"
import { ApiError } from "@/lib/api/client"

// ── Constantes ────────────────────────────────────────────────────────────────

type Tab = "professores" | "turmas" | "alunos" | "responsaveis"

const SERIES = [
  "Maternal I","Maternal II","Pré I","Pré II",
  "1º Ano","2º Ano","3º Ano","4º Ano","5º Ano",
  "6º Ano","7º Ano","8º Ano","9º Ano",
  "1º Médio","2º Médio","3º Médio",
]
const LETRAS   = ["A","B","C","D"]
const TURNOS   = ["Manhã","Tarde"]
const UNIDADES = ["Cabo","Gaibu"]

// ── Sub-componentes de UI ─────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</label>
      {children}
    </div>
  )
}

const inp =
  "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#4A0010] outline-none transition focus:border-[#C71F2D] focus:ring-2 focus:ring-[#C71F2D]/10 placeholder:text-slate-300 appearance-none"

function InpIcon({ icon: Icon, ...props }: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
      <input {...props} className={`${inp} pl-9 w-full`} />
    </div>
  )
}

function SelIcon({ icon: Icon, children, ...props }: { icon: React.ElementType; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <Icon size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
      <select {...props} className={`${inp} pl-9 w-full`}>{children}</select>
    </div>
  )
}

function SaveBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full rounded-xl bg-[#4A0010] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#6B0018] disabled:opacity-60">
      {loading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : label}
    </button>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return msg ? (
    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-[#C71F2D]">{msg}</p>
  ) : null
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
      <School size={36} className="opacity-30" />
      <p className="text-sm font-bold">{label}</p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A0010]/20 border-t-[#4A0010]" />
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

// ── Badge de status de e-mail ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: Responsavel["status_email"] }) {
  const map = {
    confirmado:     { label: "Confirmado",     cls: "bg-emerald-100 text-emerald-700" },
    aguardando:     { label: "Aguardando",     cls: "bg-amber-100 text-amber-700"    },
    troca_pendente: { label: "Troca pendente", cls: "bg-blue-100 text-blue-700"      },
  }
  const { label, cls } = map[status]
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${cls}`}>{label}</span>
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function CadastrosPage() {
  const [tab, setTab]                 = useState<Tab>("professores")
  const [professores, setProfessores] = useState<Professor[]>([])
  const [turmas, setTurmas]           = useState<Turma[]>([])
  const [alunos, setAlunos]           = useState<Aluno[]>([])
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])

  const [loading, setLoading]         = useState(false)
  const [saving,  setSaving]          = useState(false)
  const [formErr, setFormErr]         = useState("")
  const [showForm, setShowForm]       = useState(false)
  const [editingId, setEditingId]     = useState<number | null>(null)
  const [deletingId, setDeletingId]   = useState<number | null>(null)
  // Estado inline de "alterar e-mail" (separado do form de criar/editar)
  const [alterandoEmailId, setAlterandoEmailId] = useState<number | null>(null)
  const [novoEmail, setNovoEmail]     = useState("")
  const [emailErr, setEmailErr]       = useState("")
  const [emailMsg, setEmailMsg]       = useState("")

  // ── Carrega dados da API ───────────────────────────────────────────────────

  const carregarProfessores = useCallback(async () => {
    setLoading(true)
    try { setProfessores((await professoresApi.listar()).professores) }
    catch { /* silencia — mostrado como lista vazia */ }
    finally { setLoading(false) }
  }, [])

  const carregarTurmas = useCallback(async () => {
    setLoading(true)
    try { setTurmas((await turmasApi.listar()).turmas) }
    catch { }
    finally { setLoading(false) }
  }, [])

  const carregarAlunos = useCallback(async () => {
    setLoading(true)
    try { setAlunos((await alunosApi.listar()).alunos) }
    catch { }
    finally { setLoading(false) }
  }, [])

  const carregarResponsaveis = useCallback(async () => {
    setLoading(true)
    try { setResponsaveis((await responsaveisApi.listar()).responsaveis) }
    catch { }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (tab === "professores")    carregarProfessores()
    else if (tab === "turmas")    carregarTurmas()
    else if (tab === "alunos")    carregarAlunos()
    else                          carregarResponsaveis()
    setShowForm(false)
    setEditingId(null)
    setDeletingId(null)
    setAlterandoEmailId(null)
    setFormErr("")
    setEmailMsg("")
  }, [tab, carregarProfessores, carregarTurmas, carregarAlunos, carregarResponsaveis])

  // ── Helpers de form ────────────────────────────────────────────────────────

  function cancelarForm() {
    setShowForm(false)
    setEditingId(null)
    setFormErr("")
  }

  function iniciarEdicao(id: number) {
    setEditingId(id)
    setShowForm(true)
    setFormErr("")
    setDeletingId(null)
  }

  function toggleDelete(id: number) {
    setDeletingId(prev => prev === id ? null : id)
    setEditingId(null)
    setShowForm(false)
  }

  async function confirmarDelete(del: () => Promise<{ mensagem: string }>, recarregar: () => Promise<void>) {
    try {
      await del()
      setDeletingId(null)
      await recarregar()
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao excluir")
    }
  }

  function currentProf(): Professor | undefined {
    return professores.find(p => p.id === editingId)
  }
  function currentTurma(): Turma | undefined {
    return turmas.find(t => t.id === editingId)
  }
  function currentAluno(): Aluno | undefined {
    return alunos.find(a => a.id === editingId)
  }

  // ── Handlers de submit ─────────────────────────────────────────────────────

  async function submitProfessor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormErr("")
    const fd  = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? "").trim()

    setSaving(true)
    try {
      if (editingId) {
        const patch: Record<string, string> = {}
        if (get("nome"))    patch.nome    = get("nome")
        if (get("usuario")) patch.usuario = get("usuario")
        if (get("email"))   patch.email   = get("email")
        if (get("senha"))   patch.senha   = get("senha")
        await professoresApi.editar(editingId, patch)
      } else {
        await professoresApi.criar({
          nome: get("nome"), usuario: get("usuario"),
          email: get("email"),
          senha: get("senha"),
        })
      }
      cancelarForm()
      await carregarProfessores()
    } catch (err) {
      setFormErr(err instanceof ApiError ? err.message : "Erro ao salvar professor")
    } finally {
      setSaving(false)
    }
  }

  async function submitTurma(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormErr("")
    const fd    = new FormData(e.currentTarget)
    const get   = (k: string) => String(fd.get(k) ?? "").trim()
    const profId = Number(fd.get("professor_id")) || null

    setSaving(true)
    try {
      if (editingId) {
        await turmasApi.editar(editingId, {
          serie: get("serie"), turma: get("letra"),
          turno: get("turno"), unidade: get("unidade"),
          professor_id: profId,
        })
      } else {
        await turmasApi.criar({
          serie: get("serie"), turma: get("letra"),
          turno: get("turno"), unidade: get("unidade"),
          professor_id: profId,
        })
      }
      cancelarForm()
      await carregarTurmas()
    } catch (err) {
      setFormErr(err instanceof ApiError ? err.message : "Erro ao salvar turma")
    } finally {
      setSaving(false)
    }
  }

  async function submitAluno(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormErr("")
    const fd     = new FormData(e.currentTarget)
    const get    = (k: string) => String(fd.get(k) ?? "").trim()
    const turmaId = Number(fd.get("turmaId")) || null
    const respId  = Number(fd.get("responsavelId")) || null

    setSaving(true)
    try {
      if (editingId) {
        await alunosApi.editar(editingId, {
          nome: get("nome"), genero: get("genero") as "M"|"F",
          turma_id: turmaId, responsavel_id: respId,
        })
      } else {
        await alunosApi.criar({
          nome: get("nome"), genero: get("genero") as "M"|"F",
          turma_id: turmaId, responsavel_id: respId,
        })
      }
      cancelarForm()
      await carregarAlunos()
    } catch (err) {
      setFormErr(err instanceof ApiError ? err.message : "Erro ao salvar aluno")
    } finally {
      setSaving(false)
    }
  }

  // ── Handlers de responsáveis ──────────────────────────────────────────────

  async function submitResponsavel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormErr("")
    const fd  = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? "").trim()

    setSaving(true)
    try {
      if (editingId) {
        await responsaveisApi.editarNome(editingId, get("nome"))
      } else {
        await responsaveisApi.criar({ nome: get("nome"), email: get("email") })
      }
      cancelarForm()
      await carregarResponsaveis()
    } catch (err) {
      setFormErr(err instanceof ApiError ? err.message : "Erro ao salvar responsável")
    } finally {
      setSaving(false)
    }
  }

  async function handleAlterarEmail(respId: number) {
    if (!novoEmail.trim()) { setEmailErr("Informe o novo e-mail."); return }
    setEmailErr("")
    setSaving(true)
    try {
      const res = await responsaveisApi.alterarEmail(respId, novoEmail.trim())
      setEmailMsg(res.mensagem)
      setNovoEmail("")
      setAlterandoEmailId(null)
      await carregarResponsaveis()
    } catch (err) {
      setEmailErr(err instanceof ApiError ? err.message : "Erro ao alterar e-mail")
    } finally {
      setSaving(false)
    }
  }

  async function handleReenviarEmail(respId: number) {
    try {
      const res = await responsaveisApi.reenviarConfirmacao(respId)
      setEmailMsg(res.mensagem)
    } catch (err) {
      setEmailMsg(err instanceof ApiError ? err.message : "Erro ao reenviar e-mail")
    }
  }

  // ── Abas ───────────────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { key: "professores",  label: "Professores",  icon: GraduationCap, count: professores.length  },
    { key: "turmas",       label: "Turmas",       icon: Users,          count: turmas.length       },
    { key: "responsaveis", label: "Responsáveis",  icon: User,           count: responsaveis.length },
    { key: "alunos",       label: "Alunos",        icon: BookOpen,       count: alunos.length       },
  ]

  const addLabel =
    tab === "professores"  ? "Novo professor"  :
    tab === "turmas"       ? "Nova turma"      :
    tab === "responsaveis" ? "Novo responsável" : "Novo aluno"

  const isFormOpen = showForm || editingId !== null

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-[#4A0010] sm:text-3xl">Cadastros</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie professores, turmas, responsáveis e alunos. Crie na ordem: professor → turma → responsável → aluno.
        </p>
      </div>

      {/* Abas */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
              tab === key ? "bg-[#4A0010] text-white shadow-lg" : "bg-white text-[#4A0010] shadow-sm hover:bg-[#4A0010]/8"
            }`}>
            <Icon size={16} />
            {label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${tab === key ? "bg-white/20" : "bg-[#4A0010]/10"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Painel */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        {/* Cabeçalho do painel */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-black capitalize text-[#4A0010]">
            {tabs.find(t => t.key === tab)?.label}
          </h2>
          <button onClick={() => { isFormOpen ? cancelarForm() : setShowForm(true) }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black text-white shadow-sm transition ${
              isFormOpen ? "bg-slate-400 hover:bg-slate-500" : "bg-[#C71F2D] hover:bg-[#a81826]"
            }`}>
            {isFormOpen ? <><X size={15} /> Cancelar</> : <><Plus size={15} /> {addLabel}</>}
          </button>
        </div>

        {/* Formulário inline */}
        {isFormOpen && (
          <div className="border-b border-slate-100 bg-[#FFF5F5] p-6">
            <p className="mb-4 text-xs font-black uppercase tracking-wider text-[#C71F2D]">
              {editingId ? `Editando ${tab === "professores" ? "professor" : tab === "turmas" ? "turma" : "aluno"}` : addLabel}
            </p>

            {/* ── Form Professor ── */}
            {tab === "professores" && (
              <form onSubmit={submitProfessor} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Nome completo *">
                  <InpIcon icon={User} name="nome" required placeholder="Ex: Maria da Silva"
                    defaultValue={currentProf()?.nome} />
                </Field>
                <Field label={editingId ? "Login (username)" : "Login *"}>
                  <InpIcon icon={KeyRound} name="usuario" required={!editingId}
                    placeholder="Ex: maria.silva" defaultValue={currentProf()?.usuario} />
                </Field>
                <Field label={editingId ? "E-mail" : "E-mail *"}>
                  <InpIcon icon={Mail} name="email" type="email" required={!editingId}
                    placeholder="professor@escola.edu.br" defaultValue={currentProf()?.email} />
                </Field>
                <Field label={editingId ? "Nova senha (opcional)" : "Senha *"}>
                  <InpIcon icon={KeyRound} name="senha" type="password" required={!editingId}
                    placeholder={editingId ? "Deixe vazio para manter" : "Mínimo 6 caracteres"} />
                </Field>
                <div className="flex items-end gap-2">
                  <SaveBtn loading={saving} label={editingId ? "Atualizar" : "Salvar professor"} />
                </div>
                {formErr && <div className="sm:col-span-2 lg:col-span-3"><ErrorMsg msg={formErr} /></div>}
              </form>
            )}

            {/* ── Form Turma ── */}
            {tab === "turmas" && (
              <form onSubmit={submitTurma} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Série *">
                  <SelIcon icon={School} name="serie" required defaultValue={currentTurma()?.serie ?? SERIES[4]}>
                    {SERIES.map(s => <option key={s}>{s}</option>)}
                  </SelIcon>
                </Field>
                <Field label="Turma *">
                  <select name="letra" required className={inp} defaultValue={currentTurma()?.turma ?? "A"}>
                    {LETRAS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Turno *">
                  <SelIcon icon={Clock} name="turno" required defaultValue={currentTurma()?.turno ?? "Manhã"}>
                    {TURNOS.map(t => <option key={t}>{t}</option>)}
                  </SelIcon>
                </Field>
                <Field label="Unidade *">
                  <SelIcon icon={MapPin} name="unidade" required defaultValue={currentTurma()?.unidade ?? "Cabo"}>
                    {UNIDADES.map(u => <option key={u}>{u}</option>)}
                  </SelIcon>
                </Field>
                <Field label="Professor responsável">
                  <SelIcon icon={GraduationCap} name="professor_id"
                    defaultValue={currentTurma()?.professor_id ?? ""}>
                    <option value="">Selecionar professor</option>
                    {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </SelIcon>
                </Field>
                <div className="flex items-end gap-2">
                  <SaveBtn loading={saving} label={editingId ? "Atualizar" : "Salvar turma"} />
                </div>
                {formErr && <div className="sm:col-span-2 lg:col-span-3"><ErrorMsg msg={formErr} /></div>}
              </form>
            )}

            {/* ── Form Aluno ── */}
            {tab === "alunos" && (
              <form onSubmit={submitAluno} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Nome completo *">
                  <InpIcon icon={User} name="nome" required placeholder="Ex: João Pedro da Silva"
                    defaultValue={currentAluno()?.nome} />
                </Field>
                <Field label="Gênero *">
                  <select name="genero" required className={inp} defaultValue={currentAluno()?.genero ?? ""}>
                    <option value="" disabled>Selecionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </Field>
                <Field label="Turma">
                  <SelIcon icon={Users} name="turmaId" defaultValue={currentAluno()?.turma_id ?? ""}>
                    <option value="">Selecionar turma</option>
                    {turmas.map(t => <option key={t.id} value={t.id}>{t.label} — {t.unidade}</option>)}
                  </SelIcon>
                </Field>
                <Field label="Responsável">
                  <SelIcon icon={User} name="responsavelId" defaultValue={currentAluno()?.responsavel_id ?? ""}>
                    <option value="">Selecionar responsável</option>
                    {/* Lista dinâmica — idealmente viria da API; por ora listamos os do seed */}
                  </SelIcon>
                </Field>
                <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                  <SaveBtn loading={saving} label={editingId ? "Atualizar" : "Salvar aluno"} />
                </div>
                {formErr && <div className="sm:col-span-2 lg:col-span-3"><ErrorMsg msg={formErr} /></div>}
              </form>
            )}

            {/* ── Form Responsável ── */}
            {tab === "responsaveis" && (
              <form onSubmit={submitResponsavel} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Nome completo *">
                  <InpIcon icon={User} name="nome" required placeholder="Ex: Ana Barbosa"
                    defaultValue={responsaveis.find(r => r.id === editingId)?.nome} />
                </Field>
                {!editingId && (
                  <Field label="E-mail *">
                    <InpIcon icon={Mail} name="email" type="email" required
                      placeholder="responsavel@email.com" />
                  </Field>
                )}
                <div className="flex items-end">
                  <SaveBtn loading={saving} label={editingId ? "Atualizar nome" : "Criar e enviar convite"} />
                </div>
                {formErr && <div className="sm:col-span-2 lg:col-span-3"><ErrorMsg msg={formErr} /></div>}
              </form>
            )}
          </div>
        )}

        {/* Mensagem de feedback de e-mail (reenvio / troca) */}
        {emailMsg && tab === "responsaveis" && (
          <div className="border-b border-slate-100 bg-emerald-50 px-6 py-3">
            <p className="text-sm font-bold text-emerald-700">{emailMsg}</p>
            <button onClick={() => setEmailMsg("")} className="mt-0.5 text-xs text-emerald-500 hover:underline">Fechar</button>
          </div>
        )}

        {/* Listas */}
        {loading ? <LoadingState /> : (

          <>
            {/* ── Lista Professores ── */}
            {tab === "professores" && (
              professores.length === 0 ? <EmptyState label="Nenhum professor cadastrado." /> : (
                <div className="divide-y divide-slate-50">
                  <div className="hidden grid-cols-[1fr_1fr_1.5fr_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 lg:grid">
                    <span>Nome</span><span>Login</span><span>E-mail</span><span />
                  </div>
                  {professores.map(p => (
                    <div key={p.id} className={`px-6 py-4 transition ${deletingId === p.id ? "bg-red-50" : "hover:bg-slate-50"} lg:grid lg:grid-cols-[1fr_1fr_1.5fr_auto] lg:items-center lg:gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A0010]/10 text-xs font-black text-[#4A0010]">
                          {p.nome.split(" ").slice(0,2).map(n=>n[0]).join("")}
                        </div>
                        <span className="font-black text-[#4A0010]">{p.nome}</span>
                      </div>
                      <span className="mt-1 pl-12 text-sm text-slate-500 lg:mt-0 lg:pl-0">{p.usuario}</span>
                      <span className="hidden text-sm text-slate-500 lg:block">{p.email}</span>
                      <div className="mt-2 flex items-center gap-1 lg:mt-0">
                        {deletingId === p.id ? (
                          <>
                            <span className="mr-1 text-xs font-bold text-red-600">Excluir?</span>
                            <button onClick={() => confirmarDelete(() => professoresApi.excluir(p.id), carregarProfessores)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-700">Sim</button>
                            <button onClick={() => setDeletingId(null)}
                              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-300">Não</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => iniciarEdicao(p.id)} title="Editar"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#4A0010]/10 hover:text-[#4A0010]">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => toggleDelete(p.id)} title="Excluir"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── Lista Turmas ── */}
            {tab === "turmas" && (
              turmas.length === 0 ? <EmptyState label="Nenhuma turma cadastrada." /> : (
                <div className="divide-y divide-slate-50">
                  <div className="hidden grid-cols-[1fr_auto_auto_1fr_auto_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 lg:grid">
                    <span>Turma</span><span>Turno</span><span>Unidade</span><span>Professor</span><span>Alunos</span><span />
                  </div>
                  {turmas.map(t => (
                    <div key={t.id} className={`px-6 py-4 transition ${deletingId === t.id ? "bg-red-50" : "hover:bg-slate-50"} lg:grid lg:grid-cols-[1fr_auto_auto_1fr_auto_auto] lg:items-center lg:gap-4`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C71F2D]/10">
                          <Users size={16} className="text-[#C71F2D]" />
                        </div>
                        <div>
                          <p className="font-black text-[#4A0010]">{t.label}</p>
                          <p className="text-xs text-slate-400 lg:hidden">{t.unidade} · {t.professor?.nome ?? "Sem professor"}</p>
                        </div>
                      </div>
                      <span className="hidden text-sm text-slate-500 lg:block">{t.turno}</span>
                      <span className="hidden lg:block">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-black ${t.unidade === "Cabo" ? "bg-[#FF7A1C]/10 text-[#FF7A1C]" : "bg-[#0057D9]/10 text-[#0057D9]"}`}>
                          {t.unidade}
                        </span>
                      </span>
                      <span className="hidden items-center gap-1.5 text-sm text-slate-600 lg:flex">
                        {t.professor ? <><GraduationCap size={13} className="shrink-0 text-slate-400" />{t.professor.nome}</> : <span className="italic text-slate-400">Sem professor</span>}
                      </span>
                      <span className="hidden lg:block">
                        <span className="flex items-center gap-1 rounded-full bg-[#4A0010]/8 px-3 py-1 text-xs font-black text-[#4A0010]">
                          <BookOpen size={11} />{t.total_alunos ?? 0} aluno{t.total_alunos !== 1 ? "s" : ""}
                        </span>
                      </span>
                      <div className="mt-2 flex items-center gap-1 lg:mt-0">
                        {deletingId === t.id ? (
                          <>
                            <span className="mr-1 text-xs font-bold text-red-600">Excluir?</span>
                            <button onClick={() => confirmarDelete(() => turmasApi.excluir(t.id), carregarTurmas)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-700">Sim</button>
                            <button onClick={() => setDeletingId(null)}
                              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-300">Não</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => iniciarEdicao(t.id)} title="Editar"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#4A0010]/10 hover:text-[#4A0010]">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => toggleDelete(t.id)} title="Excluir"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── Lista Alunos ── */}
            {tab === "alunos" && (
              alunos.length === 0 ? <EmptyState label="Nenhum aluno cadastrado." /> : (
                <div className="divide-y divide-slate-50">
                  <div className="hidden grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 lg:grid">
                    <span>Mat.</span><span>Nome</span><span>Turma</span><span>Responsável</span><span />
                  </div>
                  {alunos.map(a => (
                    <div key={a.id} className={`px-6 py-4 transition ${deletingId === a.id ? "bg-red-50" : "hover:bg-slate-50"} lg:grid lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-center lg:gap-4`}>
                      <span className="hidden shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500 lg:inline-block">{a.matricula}</span>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${a.genero === "F" ? "bg-[#C71F2D]" : "bg-[#071D5B]"}`}>
                          {a.nome.split(" ").slice(0,2).map(n=>n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-black text-[#4A0010]">{a.nome}</p>
                          <p className="text-xs text-slate-400 lg:hidden">Mat. {a.matricula} · {a.turma?.label ?? "Sem turma"}</p>
                        </div>
                      </div>
                      <span className="hidden text-sm text-slate-700 lg:block">{a.turma?.label ?? <span className="italic text-slate-400">Sem turma</span>}</span>
                      <div className="hidden flex-col lg:flex">
                        <span className="text-sm text-slate-700">{a.responsavel?.nome ?? <span className="italic text-slate-400">Sem responsável</span>}</span>
                        {a.responsavel && <span className="text-xs text-slate-400">{a.responsavel.email}</span>}
                      </div>
                      <div className="mt-2 flex items-center gap-1 lg:mt-0">
                        {deletingId === a.id ? (
                          <>
                            <span className="mr-1 text-xs font-bold text-red-600">Excluir?</span>
                            <button onClick={() => confirmarDelete(() => alunosApi.excluir(a.id), carregarAlunos)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-700">Sim</button>
                            <button onClick={() => setDeletingId(null)}
                              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-300">Não</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => iniciarEdicao(a.id)} title="Editar"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#4A0010]/10 hover:text-[#4A0010]">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => toggleDelete(a.id)} title="Excluir"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            {/* ── Lista Responsáveis ── */}
            {tab === "responsaveis" && (
              responsaveis.length === 0 ? <EmptyState label="Nenhum responsável cadastrado." /> : (
                <div className="divide-y divide-slate-50">
                  <div className="hidden grid-cols-[1fr_1.5fr_auto_auto] gap-4 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-400 lg:grid">
                    <span>Nome</span><span>E-mail</span><span>Status</span><span />
                  </div>
                  {responsaveis.map(r => (
                    <div key={r.id} className={`px-6 py-4 transition ${deletingId === r.id ? "bg-red-50" : "hover:bg-slate-50"}`}>
                      {/* Linha principal */}
                      <div className="lg:grid lg:grid-cols-[1fr_1.5fr_auto_auto] lg:items-center lg:gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${r.email_confirmado ? "bg-[#4A0010]" : "bg-slate-400"}`}>
                            {r.nome.split(" ").slice(0,2).map(n=>n[0]).join("")}
                          </div>
                          <span className="font-black text-[#4A0010]">{r.nome}</span>
                        </div>
                        <div className="mt-1 pl-12 lg:mt-0 lg:pl-0">
                          <span className="text-sm text-slate-600">{r.email}</span>
                          {r.email_pendente && (
                            <p className="text-xs text-blue-500">Troca para: {r.email_pendente}</p>
                          )}
                        </div>
                        <div className="mt-2 pl-12 lg:mt-0 lg:pl-0">
                          <StatusBadge status={r.status_email} />
                        </div>
                        <div className="mt-2 flex items-center gap-1 lg:mt-0">
                          {deletingId === r.id ? (
                            <>
                              <span className="mr-1 text-xs font-bold text-red-600">Excluir?</span>
                              <button onClick={() => confirmarDelete(() => responsaveisApi.excluir(r.id), carregarResponsaveis)}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-700">Sim</button>
                              <button onClick={() => setDeletingId(null)}
                                className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-300">Não</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => iniciarEdicao(r.id)} title="Editar nome"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#4A0010]/10 hover:text-[#4A0010]">
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => { setAlterandoEmailId(prev => prev === r.id ? null : r.id); setNovoEmail(""); setEmailErr("") }}
                                title="Alterar e-mail"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-100 hover:text-blue-600">
                                <Mail size={15} />
                              </button>
                              {r.status_email !== "confirmado" && (
                                <button onClick={() => handleReenviarEmail(r.id)} title="Reenviar e-mail"
                                  className="rounded-lg bg-[#4A0010]/8 px-2.5 py-1.5 text-xs font-black text-[#4A0010] hover:bg-[#4A0010]/15">
                                  Reenviar
                                </button>
                              )}
                              <button onClick={() => toggleDelete(r.id)} title="Excluir"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600">
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline: alterar e-mail */}
                      {alterandoEmailId === r.id && (
                        <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                          <p className="mb-2 text-xs font-black uppercase tracking-wider text-blue-600">
                            {r.email_confirmado ? "Alterar e-mail (envia confirmação ao novo endereço)" : "Corrigir e-mail (reenvia link de ativação)"}
                          </p>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Mail size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input
                                type="email" value={novoEmail}
                                onChange={e => { setNovoEmail(e.target.value); setEmailErr("") }}
                                placeholder="novo@email.com"
                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                              />
                            </div>
                            <button onClick={() => handleAlterarEmail(r.id)} disabled={saving}
                              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60">
                              {saving ? "..." : "Salvar"}
                            </button>
                            <button onClick={() => { setAlterandoEmailId(null); setEmailErr("") }}
                              className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-300">
                              Cancelar
                            </button>
                          </div>
                          {emailErr && <p className="mt-2 text-xs font-bold text-red-600">{emailErr}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        {/* Rodapé com fluxo */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {([["professores","Professor"],["turmas","Turma"],["responsaveis","Responsável"],["alunos","Aluno"]] as [Tab,string][]).map(([key, label], i) => (
              <span key={key} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={12} />}
                <span className={`font-black ${tab === key ? "text-[#4A0010]" : ""}`}>{i+1}. {label}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
