"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Download, FileCheck, FileText, Loader2 } from "lucide-react"
import { MOCK_STUDENTS } from "@/lib/portal/mock-data"
import type { Student } from "@/lib/portal/types"

type Declaration = {
  id: string
  title: string
  description: string
  icon: typeof FileText
  color: string
  generate: (student: Student, date: string) => string
}

function today() {
  return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
}

function schoolHeader() {
  return `
    <div style="text-align:center;border-bottom:3px solid #071D5B;padding-bottom:16px;margin-bottom:24px">
      <p style="margin:0;font-size:11px;font-weight:bold;color:#888;letter-spacing:.1em">COLÉGIO E CURSO</p>
      <h1 style="margin:4px 0 0;font-size:22px;font-weight:900;color:#071D5B">CORAÇÃO DE MARIA</h1>
      <p style="margin:4px 0 0;font-size:11px;color:#888">Unidade Cabo de Santo Agostinho | Unidade Gaibu</p>
    </div>`
}

function docWrapper(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:40px;color:#071D5B;background:#fff;max-width:700px;margin:0 auto;padding:40px}
  p{line-height:1.8;font-size:14px}
  .sign{margin-top:60px;text-align:center}
  .sign-line{border-top:1px solid #071D5B;width:260px;display:inline-block;margin-bottom:4px}
  .footer{margin-top:40px;border-top:1px solid #ddd;padding-top:12px;font-size:11px;color:#888;text-align:center}
  @media print{body{padding:20px}}
</style>
</head>
<body>
${schoolHeader()}
${body}
<div class="footer">Documento emitido eletronicamente pelo Portal do Aluno — Colégio e Curso Coração de Maria</div>
<script>window.onload=()=>window.print()</script>
</body>
</html>`
}

const declarations: Declaration[] = [
  {
    id: "matricula",
    title: "Declaração de Matrícula",
    description: "Comprova que o aluno está regularmente matriculado na instituição.",
    icon: FileCheck,
    color: "#0057D9",
    generate: (s, date) => docWrapper("Declaração de Matrícula", `
      <h2 style="text-align:center;letter-spacing:.05em;font-size:16px">DECLARAÇÃO DE MATRÍCULA</h2>
      <p>Declaramos, para os devidos fins, que <strong>${s.name.toUpperCase()}</strong> encontra-se
      regularmente matriculado(a) nesta instituição de ensino, no ano letivo de 2026,
      cursando o <strong>${s.grade} — Turma ${s.class}</strong> (${s.schoolLevel ?? ""}),
      no turno da <strong>${s.shift}</strong>, na Unidade <strong>${s.unit}</strong>.</p>
      <p>Matrícula nº <strong>${(s.matricula ?? "").padStart(6, "0")}</strong>. Situação: <strong>MATRICULADO(A)</strong>.</p>
      <p>Por ser verdade, firmo a presente declaração para que surta os devidos efeitos legais.</p>
      <p>Cabo de Santo Agostinho, ${date}.</p>
      <div class="sign"><div class="sign-line"></div><br/><strong>Direção Escolar</strong><br/>Colégio e Curso Coração de Maria</div>`),
  },
  {
    id: "escolaridade",
    title: "Atestado de Escolaridade",
    description: "Certifica que o aluno frequenta regularmente esta instituição de ensino.",
    icon: FileText,
    color: "#22c55e",
    generate: (s, date) => docWrapper("Atestado de Escolaridade", `
      <h2 style="text-align:center;letter-spacing:.05em;font-size:16px">ATESTADO DE ESCOLARIDADE</h2>
      <p>Atestamos, para os devidos fins, que <strong>${s.name.toUpperCase()}</strong>,
      matrícula nº <strong>${(s.matricula ?? "").padStart(6, "0")}</strong>,
      é aluno(a) regularmente matriculado(a) neste estabelecimento de ensino,
      cursando o <strong>${s.grade}</strong> (${s.schoolLevel ?? ""}),
      no turno da <strong>${s.shift}</strong>, Unidade <strong>${s.unit}</strong>,
      no ano letivo de <strong>2026</strong>.</p>
      <p>O presente atestado é fornecido a pedido do(a) interessado(a) ou de seu(sua) responsável.</p>
      <p>Cabo de Santo Agostinho, ${date}.</p>
      <div class="sign"><div class="sign-line"></div><br/><strong>Secretaria Escolar</strong><br/>Colégio e Curso Coração de Maria</div>`),
  },
  {
    id: "frequencia",
    title: "Declaração de Frequência",
    description: "Informa o percentual de presença do aluno no período letivo.",
    icon: FileText,
    color: "#f59e0b",
    generate: (s, date) => docWrapper("Declaração de Frequência", `
      <h2 style="text-align:center;letter-spacing:.05em;font-size:16px">DECLARAÇÃO DE FREQUÊNCIA</h2>
      <p>Declaramos que <strong>${s.name.toUpperCase()}</strong>,
      matrícula nº <strong>${(s.matricula ?? "").padStart(6, "0")}</strong>,
      aluno(a) do <strong>${s.grade} — Turma ${s.class}</strong>,
      apresenta frequência de <strong>96%</strong> no período letivo de 2026
      (fevereiro a junho), conforme registros desta instituição.</p>
      <p>O aluno(a) encontra-se dentro dos parâmetros legais de frequência mínima exigida (75%).</p>
      <p>Cabo de Santo Agostinho, ${date}.</p>
      <div class="sign"><div class="sign-line"></div><br/><strong>Coordenação Pedagógica</strong><br/>Colégio e Curso Coração de Maria</div>`),
  },
  {
    id: "plano-saude",
    title: "Declaração para Plano de Saúde",
    description: "Para inclusão de dependentes em planos de saúde ou convênios médicos.",
    icon: FileText,
    color: "#E4252A",
    generate: (s, date) => docWrapper("Declaração para Plano de Saúde", `
      <h2 style="text-align:center;letter-spacing:.05em;font-size:16px">DECLARAÇÃO PARA PLANO DE SAÚDE</h2>
      <p>Declaramos, para fins de comprovação junto a planos de saúde e convênios médicos,
      que <strong>${s.name.toUpperCase()}</strong>,
      matrícula nº <strong>${(s.matricula ?? "").padStart(6, "0")}</strong>,
      é aluno(a) regularmente matriculado(a) nesta instituição de ensino privada,
      cursando o <strong>${s.grade}</strong> (${s.schoolLevel ?? ""}),
      no ano letivo de <strong>2026</strong>.</p>
      <p>Esta declaração é válida para comprovação de dependência escolar junto a operadoras de planos de saúde.</p>
      <p>Cabo de Santo Agostinho, ${date}.</p>
      <div class="sign"><div class="sign-line"></div><br/><strong>Direção Escolar</strong><br/>Colégio e Curso Coração de Maria</div>`),
  },
  {
    id: "historico",
    title: "Histórico Escolar Parcial",
    description: "Histórico das notas e situação das disciplinas no ano letivo atual.",
    icon: FileText,
    color: "#6366f1",
    generate: (s, date) => docWrapper("Histórico Escolar Parcial", `
      <h2 style="text-align:center;letter-spacing:.05em;font-size:16px">HISTÓRICO ESCOLAR PARCIAL — 2026</h2>
      <p><strong>Aluno(a):</strong> ${s.name.toUpperCase()}<br/>
      <strong>Matrícula:</strong> ${(s.matricula ?? "").padStart(6, "0")}<br/>
      <strong>Série:</strong> ${s.grade} — Turma ${s.class} — ${s.shift}<br/>
      <strong>Unidade:</strong> ${s.unit} | <strong>Professor(a) Responsável:</strong> ${s.teacher}</p>
      <p>Documento parcial referente ao ano letivo de 2026 (1º ao 3º bimestre).
      O histórico completo será emitido ao final do ano letivo.</p>
      <p>Cabo de Santo Agostinho, ${date}.</p>
      <div class="sign"><div class="sign-line"></div><br/><strong>Secretaria Escolar</strong><br/>Colégio e Curso Coração de Maria</div>`),
  },
]

export default function DeclaracoesPage() {
  const params    = useParams()
  const studentId = params.id as string
  const student   = MOCK_STUDENTS.find((s) => s.id === studentId)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  if (!student) return null

  function handleGenerate(decl: Declaration) {
    setGeneratingId(decl.id)
    setTimeout(() => {
      const html = decl.generate(student!, today())
      const win  = window.open("", "_blank")
      if (win) { win.document.write(html); win.document.close() }
      setGeneratingId(null)
    }, 600)
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1]/10 text-[#6366f1]">
          <FileText size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#071D5B]">Declarações</h1>
          <p className="text-sm text-slate-500">Documentos escolares para {student.name.split(" ")[0]}</p>
        </div>
      </div>

      <p className="mb-5 rounded-2xl bg-[#EAFBFF] px-4 py-3 text-sm text-[#071D5B]">
        Clique em <strong>Gerar</strong> para abrir o documento em nova aba e salvar como PDF através do seu navegador.
      </p>

      <div className="flex flex-col gap-3">
        {declarations.map((decl) => {
          const Icon    = decl.icon
          const loading = generatingId === decl.id
          return (
            <div key={decl.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${decl.color}15` }}>
                <Icon size={22} style={{ color: decl.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[#071D5B]">{decl.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{decl.description}</p>
              </div>
              <button
                onClick={() => handleGenerate(decl)}
                disabled={loading}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#071D5B] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0a2a80] disabled:opacity-60">
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Download size={16} />}
                Gerar
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
