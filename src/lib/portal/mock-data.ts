import type {
  Guardian,
  Student,
  SubjectGrade,
  AttendanceMonth,
  SchoolEvent,
  AgendaEntry,
  Notice,
  GalleryAlbum,
  GalleryItem,
  Boleto,
  ChatMessage,
} from "./types"

export const MOCK_GUARDIAN: Guardian = {
  id: "g1",
  name: "Larissa Barbosa Batalha",
  email: "larissa.batalha@email.com",
}

export const MOCK_GUARDIANS: Record<string, Guardian> = {
  g1: { id: "g1", name: "Larissa Barbosa Batalha",  email: "larissa.batalha@email.com"  },
  g2: { id: "g2", name: "Fernanda Souza Lima",       email: "fernanda.lima@email.com"    },
  g3: { id: "g3", name: "Carlos Ferreira Costa",     email: "carlos.costa@email.com"     },
  g4: { id: "g4", name: "Patrícia Menezes Ramos",    email: "patricia.ramos@email.com"   },
  g5: { id: "g5", name: "Roberto Cavalcanti Braga",  email: "roberto.braga@email.com"    },
  g6: { id: "g6", name: "Juliana Almeida Santos",    email: "juliana.santos@email.com"   },
}

export const MOCK_PASSWORD = "123456"

export const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Dionísio Barbosa Batalha",
    gender: "M",
    grade: "4º Ano",
    class: "A",
    shift: "Manhã",
    teacher: "Profª Paula Virgínia",
    unit: "Cabo",
    notifications: 3,
    guardianIds: ["g1"],
    photoPath: "/images/alunos/cabo/4f1am/363.png",
    matricula: "363",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  {
    id: "s2",
    name: "Hera Barbosa Batalha",
    gender: "F",
    grade: "1º Ano",
    class: "B",
    shift: "Tarde",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 1,
    guardianIds: ["g1"],
    photoPath: "/images/alunos/gaibu/1f1bt/262.png",
    matricula: "262",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  // 1º Ano A — Manhã (Gaibu) — Profª Luana Marcela
  {
    id: "s3",
    name: "Valentina Souza Lima",
    gender: "F",
    grade: "1º Ano",
    class: "A",
    shift: "Manhã",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 0,
    guardianIds: ["g2"],
    matricula: "271",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  {
    id: "s4",
    name: "Miguel Ferreira Costa",
    gender: "M",
    grade: "1º Ano",
    class: "A",
    shift: "Manhã",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 0,
    guardianIds: ["g3"],
    matricula: "274",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  {
    id: "s5",
    name: "Isabella Menezes Ramos",
    gender: "F",
    grade: "1º Ano",
    class: "A",
    shift: "Manhã",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 0,
    guardianIds: ["g4"],
    matricula: "278",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  // 1º Ano B — Tarde (Gaibu) — Profª Luana Marcela
  {
    id: "s6",
    name: "Théo Cavalcanti Braga",
    gender: "M",
    grade: "1º Ano",
    class: "B",
    shift: "Tarde",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 0,
    guardianIds: ["g5"],
    matricula: "265",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
  {
    id: "s7",
    name: "Sofia Almeida Santos",
    gender: "F",
    grade: "1º Ano",
    class: "B",
    shift: "Tarde",
    teacher: "Profª Luana Marcela",
    unit: "Gaibu",
    notifications: 0,
    guardianIds: ["g6"],
    matricula: "268",
    etapa: "F1",
    schoolLevel: "ENSINO FUNDAMENTAL I",
  },
]

export const MOCK_GRADES: Record<string, SubjectGrade[]> = {
  s1: [
    { subject: "Língua Portuguesa", b1: 8.5, b2: 9.0, b3: 8.0, b4: null, status: "Em curso" },
    { subject: "Matemática",        b1: 7.5, b2: 8.0, b3: 7.0, b4: null, status: "Em curso" },
    { subject: "Ciências",          b1: 9.0, b2: 9.5, b3: 9.0, b4: null, status: "Em curso" },
    { subject: "História",          b1: 8.0, b2: 7.5, b3: 8.5, b4: null, status: "Em curso" },
    { subject: "Geografia",         b1: 9.5, b2: 8.0, b3: 9.0, b4: null, status: "Em curso" },
    { subject: "Artes",             b1: 10,  b2: 10,  b3: 10,  b4: null, status: "Em curso" },
    { subject: "Educação Física",   b1: 10,  b2: 10,  b3: 10,  b4: null, status: "Em curso" },
    { subject: "Ensino Religioso",  b1: 9.0, b2: 9.5, b3: 9.0, b4: null, status: "Em curso" },
  ],
  s2: [
    { subject: "Linguagem",              b1: "MB", b2: "MB", b3: "B",  b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",     b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade",  b1: "B",  b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Arte",                  b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",      b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
  ],
  s3: [
    { subject: "Linguagem",             b1: "MB", b2: "B",  b3: "MB", b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",    b1: "B",  b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Arte",                 b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",     b1: "MB", b2: "B",  b3: "MB", b4: null, status: "Em curso" },
  ],
  s4: [
    { subject: "Linguagem",             b1: "B",  b2: "B",  b3: "MB", b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",    b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "B",  b2: "B",  b3: "B",  b4: null, status: "Em curso" },
    { subject: "Arte",                 b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",     b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
  ],
  s5: [
    { subject: "Linguagem",             b1: "R",  b2: "B",  b3: "B",  b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",    b1: "B",  b2: "B",  b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "B",  b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Arte",                 b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",     b1: "B",  b2: "MB", b3: "MB", b4: null, status: "Em curso" },
  ],
  s6: [
    { subject: "Linguagem",             b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",    b1: "MB", b2: "B",  b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "MB", b2: "MB", b3: "B",  b4: null, status: "Em curso" },
    { subject: "Arte",                 b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",     b1: "B",  b2: "B",  b3: "MB", b4: null, status: "Em curso" },
  ],
  s7: [
    { subject: "Linguagem",             b1: "B",  b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico",    b1: "B",  b2: "B",  b3: "B",  b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Arte",                 b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade",     b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
  ],
}

export const MOCK_ATTENDANCE: Record<string, AttendanceMonth[]> = {
  s1: [
    { month: "Fev", workingDays: 20, absences: 1, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 2, justifiedAbsences: 1 },
    { month: "Mai", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Jun", workingDays: 18, absences: 1, justifiedAbsences: 0 },
  ],
  s2: [
    { month: "Fev", workingDays: 20, absences: 0, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 1, justifiedAbsences: 1 },
    { month: "Abr", workingDays: 19, absences: 0, justifiedAbsences: 0 },
    { month: "Mai", workingDays: 22, absences: 1, justifiedAbsences: 0 },
    { month: "Jun", workingDays: 18, absences: 0, justifiedAbsences: 0 },
  ],
  s3: [
    { month: "Fev", workingDays: 20, absences: 0, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 1, justifiedAbsences: 1 },
    { month: "Mai", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Jun", workingDays: 18, absences: 0, justifiedAbsences: 0 },
  ],
  s4: [
    { month: "Fev", workingDays: 20, absences: 1, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 0, justifiedAbsences: 0 },
    { month: "Mai", workingDays: 22, absences: 2, justifiedAbsences: 1 },
    { month: "Jun", workingDays: 18, absences: 0, justifiedAbsences: 0 },
  ],
  s5: [
    { month: "Fev", workingDays: 20, absences: 2, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 1, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 0, justifiedAbsences: 0 },
    { month: "Mai", workingDays: 22, absences: 1, justifiedAbsences: 1 },
    { month: "Jun", workingDays: 18, absences: 0, justifiedAbsences: 0 },
  ],
  s6: [
    { month: "Fev", workingDays: 20, absences: 0, justifiedAbsences: 0 },
    { month: "Mar", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 0, justifiedAbsences: 0 },
    { month: "Mai", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Jun", workingDays: 18, absences: 1, justifiedAbsences: 0 },
  ],
  s7: [
    { month: "Fev", workingDays: 20, absences: 1, justifiedAbsences: 1 },
    { month: "Mar", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Abr", workingDays: 19, absences: 1, justifiedAbsences: 0 },
    { month: "Mai", workingDays: 22, absences: 0, justifiedAbsences: 0 },
    { month: "Jun", workingDays: 18, absences: 0, justifiedAbsences: 0 },
  ],
}

export const MOCK_SCHOOL_EVENTS: SchoolEvent[] = [
  { id: "e1", date: "2026-06-05", title: "Dia do Meio Ambiente",        description: "Atividades especiais sobre sustentabilidade e meio ambiente na escola.",                                                                    category: "Evento"  },
  { id: "e2", date: "2026-06-10", title: "Reunião de Pais e Mestres",   description: "Reunião para acompanhamento do desempenho acadêmico dos alunos no 3º bimestre.",                                                           category: "Reunião" },
  { id: "e3", date: "2026-06-13", title: "Festa de São João",           description: "Festa junina da escola com danças, quadrilha, comidas típicas e apresentações culturais.",                                                  category: "Evento"  },
  { id: "e4", date: "2026-06-20", title: "Entrega — Projeto de Ciências", description: "Prazo final para entrega do projeto interdisciplinar de Ciências e Português.",                                                           category: "Entrega" },
  { id: "e5", date: "2026-06-25", title: "Avaliação de Língua Portuguesa", description: "Avaliação do 3º bimestre de Língua Portuguesa para o Ensino Fundamental.",                                                              category: "Prova"   },
  { id: "e6", date: "2026-07-11", title: "Início das Férias Escolares", description: "Início do recesso escolar de julho. Retorno em 28 de julho.",                                                                               category: "Feriado" },
]

export const MOCK_AGENDA_ENTRIES: Record<string, AgendaEntry[]> = {
  s1: [
    { id: "a1", date: "2026-06-01", category: "Dever de casa",  title: "Dever de Matemática entregue",    description: "Dionísio entregou o dever de matemática completo e correto. Parabéns pelo empenho!" },
    { id: "a2", date: "2026-05-28", category: "Comportamento",  title: "Conversa durante a aula",          description: "Dionísio estava conversando durante a explicação. Conversei com ele e ficou combinado que vai prestar mais atenção nas próximas aulas." },
    { id: "a3", date: "2026-05-22", category: "Elogio",         title: "Excelente apresentação de Ciências", description: "Dionísio se destacou na apresentação do projeto sobre o sistema solar. Demonstrou domínio do conteúdo e boa comunicação. Muito bem!" },
    { id: "a4", date: "2026-05-15", category: "Dever de casa",  title: "Dever de Português incompleto",   description: "Dionísio não completou o dever de português. Peço que os responsáveis acompanhem a realização das atividades em casa." },
    { id: "a5", date: "2026-05-08", category: "Participação",   title: "Ótima participação na aula de Arte", description: "Dionísio participou ativamente da aula de arte, demonstrando criatividade e entusiasmo nas atividades propostas." },
    { id: "a6", date: "2026-04-25", category: "Observação",     title: "Melhora na concentração",         description: "Percebi melhora significativa na concentração de Dionísio durante as atividades individuais. Continue assim!" },
  ],
  s2: [
    { id: "a7", date: "2026-06-01", category: "Elogio",       title: "Ótimo desenvolvimento na leitura",   description: "Hera está demonstrando grande evolução no reconhecimento de letras e sílabas. Parabéns, família!" },
    { id: "a8", date: "2026-05-20", category: "Participação", title: "Participação nas rodas de conversa", description: "Hera participou bem das rodas de conversa desta semana, compartilhando suas experiências com os amiguinhos." },
    { id: "a9", date: "2026-05-10", category: "Observação",   title: "Integração com a turma",             description: "Hera está se integrando bem com os colegas nas atividades em grupo. Está fazendo novas amizades." },
  ],
  s3: [
    { id: "a10", date: "2026-05-28", category: "Elogio",      title: "Ótima leitura em voz alta",         description: "Valentina leu um trecho do livro com muita desenvoltura e segurança. Parabéns!" },
    { id: "a11", date: "2026-04-15", category: "Participação", title: "Ótima participação em rodas de conversa", description: "Valentina se destacou nas rodas de conversa, compartilhando ideias de forma organizada." },
  ],
  s4: [
    { id: "a12", date: "2026-06-01", category: "Dever de casa", title: "Dever de Linguagem incompleto",   description: "Miguel não completou o dever de linguagem. Solicito o acompanhamento dos responsáveis." },
    { id: "a13", date: "2026-05-10", category: "Observação",    title: "Dificuldade com reconhecimento de letras", description: "Miguel ainda apresenta dificuldade com algumas letras do alfabeto. Estamos reforçando em sala." },
  ],
  s5: [
    { id: "a14", date: "2026-05-20", category: "Comportamento", title: "Dificuldade em aguardar a vez",    description: "Isabella tem dificuldade em esperar sua vez durante atividades coletivas. Estamos trabalhando isso." },
    { id: "a15", date: "2026-06-02", category: "Elogio",        title: "Melhora no convívio com a turma", description: "Isabella demonstrou uma melhora grande no respeito aos colegas nas atividades em grupo. Muito bem!" },
  ],
  s6: [
    { id: "a16", date: "2026-05-15", category: "Participação",  title: "Ótima participação em raciocínio lógico", description: "Théo resolveu os desafios de raciocínio lógico com muito empenho e rapidez." },
  ],
  s7: [
    { id: "a17", date: "2026-06-01", category: "Observação",    title: "Adaptação ao ritmo das atividades", description: "Sofia está se adaptando bem ao ritmo da turma. Percebo uma evolução gradual e constante." },
  ],
}

export const MOCK_NOTICES: Record<string, Notice[]> = {
  s1: [
    { id: "n1", date: "2026-06-01", title: "Reunião de Pais — 10/06 às 19h",     content: "Informamos que a reunião de pais e mestres acontecerá no dia 10 de junho, às 19h, no auditório da Unidade Cabo. Sua presença é fundamental para acompanhar o desenvolvimento do seu filho no 3º bimestre. Em caso de impossibilidade, entre em contato com a secretaria para agendar atendimento.", read: false, urgent: false },
    { id: "n2", date: "2026-05-28", title: "⚠️ Cancelamento de aula — 30/05",    content: "Comunicamos que as aulas do dia 30/05 (sexta-feira) foram canceladas devido à participação dos professores em formação pedagógica obrigatória. As aulas retornam normalmente na segunda-feira, dia 02/06.", read: false, urgent: true },
    { id: "n3", date: "2026-05-20", title: "Material para a Festa de São João",  content: "Pedimos que cada aluno traga até o dia 10/06 os seguintes materiais para a Festa de São João: chapéu de palha (opcional) e roupa típica junina. A escola disponibilizará alguns acessórios para quem não tiver. Contamos com a participação de todos!", read: true, urgent: false },
  ],
  s2: [
    { id: "n4", date: "2026-06-01", title: "Cardápio especial — Junho",           content: "O cardápio de junho já está disponível na secretaria e no mural da escola. Destacamos que na semana da Festa Junina (09 a 13/06) haverá merenda especial com comidas típicas regionais.", read: false, urgent: false },
  ],
  s3: [], s4: [], s5: [], s6: [], s7: [],
}

export const MOCK_GALLERY: Record<string, GalleryAlbum[]> = {
  s1: [
    { id: "ga1", date: "2026-05-20", title: "Semana do Meio Ambiente",  description: "Atividades, experimentos e projetos sobre sustentabilidade realizados pela turma do 4º Ano A.", itemCount: 12, color: "#22c55e" },
    { id: "ga2", date: "2026-05-10", title: "Seminário: Sistema Solar", description: "Apresentação dos grupos sobre planetas, estrelas e constelações para os colegas do 4º e 5º ano.",  itemCount: 8,  color: "#6366f1" },
    { id: "ga3", date: "2026-04-20", title: "Dia da Família na Escola", description: "Fotos do evento especial com a participação e integração das famílias com a escola.",              itemCount: 24, color: "#f59e0b" },
    { id: "ga4", date: "2026-03-15", title: "Semana de Arte",           description: "Exposição dos trabalhos artísticos da turma durante a Semana de Arte da escola.",                   itemCount: 15, color: "#ec4899" },
  ],
  s2: [
    { id: "ga5", date: "2026-05-28", title: "Recreação e Parque",       description: "Fotos das atividades lúdicas, brincadeiras e recreação livre da turma do Infantil B.", itemCount: 6,  color: "#0ea5e9" },
    { id: "ga6", date: "2026-05-05", title: "Homenagem às Mamães",      description: "Apresentação especial e entrega de lembrancinhas para as mamães da turma.",           itemCount: 18, color: "#ec4899" },
  ],
  s3: [], s4: [], s5: [], s6: [], s7: [],
}

function makePhotos(albumId: string, count: number): GalleryItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${albumId}-${i + 1}`,
    type: "photo" as const,
    src: `https://picsum.photos/seed/${albumId}p${i}/900/1200`,
    thumbnail: `https://picsum.photos/seed/${albumId}p${i}/400/400`,
    caption: undefined,
  }))
}

export const MOCK_GALLERY_ITEMS: Record<string, GalleryItem[]> = {
  ga1: makePhotos("ga1", 12),
  ga2: makePhotos("ga2", 8),
  ga3: makePhotos("ga3", 24),
  ga4: makePhotos("ga4", 15),
  ga5: makePhotos("ga5", 6),
  ga6: makePhotos("ga6", 18),
}

const PIX_KEY    = "financeiro@coracaodemaria.edu.br"
const BARCODE_S1 = "03399.04584 04004.200002 84440.760002 6 98050000085000"
const BARCODE_S2 = "03399.04584 04004.200002 84440.760002 6 98050000075000"

export const MOCK_BOLETOS: Record<string, Boleto[]> = {
  s1: [
    { id: "b1", title: "Mensalidade — Junho/2026",  description: "Ref. ao mês de junho de 2026 — Unidade Cabo",  value: 850, dueDate: "2026-06-10", status: "A vencer", barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b2", title: "Material Escolar 2026",      description: "Kit de materiais pedagógicos — Ano letivo 2026", value: 320, dueDate: "2026-03-15", status: "Vencido",  barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b3", title: "Mensalidade — Maio/2026",   description: "Ref. ao mês de maio de 2026 — Unidade Cabo",   value: 850, dueDate: "2026-05-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b4", title: "Mensalidade — Abril/2026",  description: "Ref. ao mês de abril de 2026 — Unidade Cabo",  value: 850, dueDate: "2026-04-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b5", title: "Mensalidade — Março/2026",  description: "Ref. ao mês de março de 2026 — Unidade Cabo",  value: 850, dueDate: "2026-03-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
  ],
  s2: [
    { id: "b6", title: "Mensalidade — Junho/2026",  description: "Ref. ao mês de junho de 2026 — Unidade Gaibu", value: 750, dueDate: "2026-06-10", status: "A vencer", barcode: BARCODE_S2, pixKey: PIX_KEY },
    { id: "b7", title: "Mensalidade — Maio/2026",   description: "Ref. ao mês de maio de 2026 — Unidade Gaibu",  value: 750, dueDate: "2026-05-10", status: "Pago",     barcode: BARCODE_S2, pixKey: PIX_KEY },
    { id: "b8", title: "Mensalidade — Abril/2026",  description: "Ref. ao mês de abril de 2026 — Unidade Gaibu", value: 750, dueDate: "2026-04-10", status: "Pago",     barcode: BARCODE_S2, pixKey: PIX_KEY },
  ],
}

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  s1: [
    { id: "c01", from: "teacher",  date: "2026-05-20", time: "08:12", read: true,  text: "Bom dia, Larissa! Tudo bem? Queria compartilhar que o Dionísio está se saindo muito bem nas aulas de Ciências. Ele demonstrou bastante entusiasmo no projeto do sistema solar." },
    { id: "c02", from: "guardian", date: "2026-05-20", time: "09:30", read: true,  text: "Bom dia, professora! Que ótima notícia! Ele realmente se animou muito com esse tema em casa também." },
    { id: "c03", from: "teacher",  date: "2026-05-20", time: "09:45", read: true,  text: "Fico feliz! Aproveito pra pedir que ele traga amanhã o dever de matemática que ficou em atraso, tá? São as páginas 34 e 35 do livro." },
    { id: "c04", from: "guardian", date: "2026-05-20", time: "11:02", read: true,  text: "Entendido! Já vou lembrar ele hoje à tarde. Obrigada por avisar." },
    { id: "c05", from: "teacher",  date: "2026-05-21", time: "08:35", read: true,  text: "Bom dia! O Dionísio trouxe o dever hoje. Parabéns, Larissa, ele estava completinho e bem feito 👏" },
    { id: "c06", from: "guardian", date: "2026-05-21", time: "12:15", read: true,  text: "Que bom, professora! A gente batalhou ontem à noite mas deu certo 😄" },
    { id: "c07", from: "teacher",  date: "2026-05-28", time: "10:00", read: true,  text: "Olá! Só pra lembrar: na sexta-feira (30/05) não haverá aula por conta da formação dos professores. As aulas retornam na segunda." },
    { id: "c08", from: "guardian", date: "2026-05-28", time: "13:40", read: true,  text: "Perfeito, obrigada pelo aviso! Já me organizarei." },
    { id: "c09", from: "teacher",  date: "2026-06-01", time: "09:10", read: true,  text: "Larissa, a reunião de pais será no dia 10/06 às 19h aqui na unidade. É importante sua presença para acompanharmos o desempenho do Dionísio no 3º bimestre." },
    { id: "c10", from: "guardian", date: "2026-06-01", time: "14:20", read: true,  text: "Anotado! Vou estar lá com certeza." },
    { id: "c11", from: "teacher",  date: "2026-06-02", time: "07:55", read: false, text: "Bom dia! Uma observação: o Dionísio estava um pouco agitado ontem durante a aula de matemática. Nada grave, só queria que vocês ficassem atentos em casa também 😊" },
  ],
  s2: [
    { id: "c12", from: "teacher",  date: "2026-05-10", time: "09:00", read: true,  text: "Oi Larissa! A Hera está se adaptando muito bem à turma. As outras crianças adoram ela!" },
    { id: "c13", from: "guardian", date: "2026-05-10", time: "10:30", read: true,  text: "Que alegria ouvir isso! Ela fica muito animada de ir pra escola todos os dias." },
    { id: "c14", from: "teacher",  date: "2026-05-10", time: "11:05", read: true,  text: "Isso é lindo! Ela está evoluindo muito na identificação das letras. Continue incentivando a leitura em casa 📚" },
    { id: "c15", from: "guardian", date: "2026-05-10", time: "18:45", read: true,  text: "Com certeza! A gente lê uma história antes de dormir toda noite." },
    { id: "c16", from: "teacher",  date: "2026-05-29", time: "08:20", read: true,  text: "Bom dia! Semana que vem teremos uma atividade especial de arte na sexta. A escola fornece os materiais, não precisa trazer nada 🎨" },
    { id: "c17", from: "guardian", date: "2026-05-29", time: "09:00", read: true,  text: "Uau, ela vai amar! Obrigada por avisar, professora." },
    { id: "c18", from: "teacher",  date: "2026-06-02", time: "08:05", read: false, text: "Olá Larissa! A Hera ficou um pouquinho quietinha hoje, diferente do habitual. Tomou água e ficou bem, mas só passando pra informar. Qualquer coisa me chame 💙" },
  ],
  s3: [
    { id: "c20", from: "guardian", date: "2026-06-02", time: "07:30", read: false, text: "Bom dia professora! A Valentina me disse que tem um trabalho de arte pra entregar esta semana. Poderia me dar mais detalhes?" },
  ],
  s4: [
    { id: "c21", from: "guardian", date: "2026-06-01", time: "16:20", read: false, text: "Boa tarde, professora! O Miguel me disse que esqueceu o dever em casa. O que eu faço?" },
    { id: "c22", from: "teacher",  date: "2026-06-02", time: "08:00", read: true,  text: "Oi! Sem problemas desta vez. O importante é que ele faça. Mas peço para reforçar o hábito de guardar o dever na mochila 😊" },
  ],
  s5: [
    { id: "c23", from: "teacher",  date: "2026-05-28", time: "10:00", read: true, text: "Oi! Só queria avisar que a Isabella está melhorando muito no convívio com os colegas. Fico muito feliz com a evolução!" },
    { id: "c24", from: "guardian", date: "2026-05-28", time: "18:30", read: true, text: "Que bom! Em casa a gente tem conversado bastante sobre isso. Muito obrigada, professora." },
  ],
  s6: [
    { id: "c25", from: "teacher",  date: "2026-06-02", time: "14:00", read: false, text: "Boa tarde! O Théo ficou com dor de barriga hoje mas ficou bem depois do almoço. Fica o aviso 😊" },
  ],
  s7: [],
}
