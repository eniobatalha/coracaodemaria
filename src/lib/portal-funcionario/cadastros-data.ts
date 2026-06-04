// Types and sessionStorage helpers for the Cadastros module
// (Professores → Turmas → Alunos)

export type ProfessorCadastrado = {
  id: string
  nome: string
  login: string
  email: string
  turmaIds: string[]
}

export type TurmaCadastrada = {
  id: string
  serie: string
  turma: string
  turno: "Manhã" | "Tarde"
  unidade: "Cabo" | "Gaibu"
  label: string
  professorId: string | null
  alunosIds: string[]
}

export type AlunoCadastrado = {
  id: string
  nome: string
  genero: "M" | "F"
  matricula: string
  turmaId: string
  responsavelNome: string
  responsavelEmail: string
}

// ─── Seed data (reflects the existing mock data) ──────────────────────────────

const SEED_PROFESSORES: ProfessorCadastrado[] = [
  {
    id: "prof-luana-marcela",
    nome: "Luana Marcela",
    login: "luana.marcela",
    email: "luana.marcela@coracaodemaria.edu.br",
    turmaIds: ["1a-manha", "1b-tarde"],
  },
  {
    id: "prof-paula-virginia",
    nome: "Paula Virgínia",
    login: "paula.virginia",
    email: "paula.virginia@coracaodemaria.edu.br",
    turmaIds: ["4a-manha-cabo"],
  },
]

const SEED_TURMAS: TurmaCadastrada[] = [
  {
    id: "1a-manha",
    serie: "1º Ano",
    turma: "A",
    turno: "Manhã",
    unidade: "Gaibu",
    label: "1º Ano A — Manhã",
    professorId: "prof-luana-marcela",
    alunosIds: ["s3", "s4", "s5"],
  },
  {
    id: "1b-tarde",
    serie: "1º Ano",
    turma: "B",
    turno: "Tarde",
    unidade: "Gaibu",
    label: "1º Ano B — Tarde",
    professorId: "prof-luana-marcela",
    alunosIds: ["s2", "s6", "s7"],
  },
  {
    id: "4a-manha-cabo",
    serie: "4º Ano",
    turma: "A",
    turno: "Manhã",
    unidade: "Cabo",
    label: "4º Ano A — Manhã",
    professorId: "prof-paula-virginia",
    alunosIds: ["s1"],
  },
]

const SEED_ALUNOS: AlunoCadastrado[] = [
  { id: "s1", nome: "Dionísio Barbosa Batalha",  genero: "M", matricula: "363", turmaId: "4a-manha-cabo",   responsavelNome: "Larissa Barbosa Batalha",  responsavelEmail: "larissa.batalha@email.com"  },
  { id: "s2", nome: "Hera Barbosa Batalha",       genero: "F", matricula: "262", turmaId: "1b-tarde",        responsavelNome: "Larissa Barbosa Batalha",  responsavelEmail: "larissa.batalha@email.com"  },
  { id: "s3", nome: "Valentina Souza Lima",        genero: "F", matricula: "271", turmaId: "1a-manha",        responsavelNome: "Fernanda Souza Lima",       responsavelEmail: "fernanda.lima@email.com"    },
  { id: "s4", nome: "Miguel Ferreira Costa",       genero: "M", matricula: "274", turmaId: "1a-manha",        responsavelNome: "Carlos Ferreira Costa",     responsavelEmail: "carlos.costa@email.com"     },
  { id: "s5", nome: "Isabella Menezes Ramos",      genero: "F", matricula: "278", turmaId: "1a-manha",        responsavelNome: "Patrícia Menezes Ramos",    responsavelEmail: "patricia.ramos@email.com"   },
  { id: "s6", nome: "Théo Cavalcanti Braga",       genero: "M", matricula: "265", turmaId: "1b-tarde",        responsavelNome: "Roberto Cavalcanti Braga",  responsavelEmail: "roberto.braga@email.com"    },
  { id: "s7", nome: "Sofia Almeida Santos",        genero: "F", matricula: "268", turmaId: "1b-tarde",        responsavelNome: "Juliana Almeida Santos",    responsavelEmail: "juliana.santos@email.com"   },
]

// ─── sessionStorage keys ──────────────────────────────────────────────────────

const KEY_PROFS  = "pf_cad_professores"
const KEY_TURMAS = "pf_cad_turmas"
const KEY_ALUNOS = "pf_cad_alunos"

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function loadProfessores(): ProfessorCadastrado[] {
  try {
    const raw = sessionStorage.getItem(KEY_PROFS)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  saveProfessores(SEED_PROFESSORES)
  return SEED_PROFESSORES
}

export function saveProfessores(data: ProfessorCadastrado[]) {
  try { sessionStorage.setItem(KEY_PROFS, JSON.stringify(data)) } catch { /* ignore */ }
}

export function loadTurmas(): TurmaCadastrada[] {
  try {
    const raw = sessionStorage.getItem(KEY_TURMAS)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  saveTurmas(SEED_TURMAS)
  return SEED_TURMAS
}

export function saveTurmas(data: TurmaCadastrada[]) {
  try { sessionStorage.setItem(KEY_TURMAS, JSON.stringify(data)) } catch { /* ignore */ }
}

export function loadAlunos(): AlunoCadastrado[] {
  try {
    const raw = sessionStorage.getItem(KEY_ALUNOS)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  saveAlunos(SEED_ALUNOS)
  return SEED_ALUNOS
}

export function saveAlunos(data: AlunoCadastrado[]) {
  try { sessionStorage.setItem(KEY_ALUNOS, JSON.stringify(data)) } catch { /* ignore */ }
}

export function nextMatricula(alunos: AlunoCadastrado[]): string {
  const max = alunos.reduce((m, a) => Math.max(m, parseInt(a.matricula) || 0), 400)
  return String(max + 1)
}
