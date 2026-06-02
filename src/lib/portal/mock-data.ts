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
} from "./types"

export const MOCK_GUARDIAN: Guardian = {
  id: "g1",
  name: "Larissa Barbosa Batalha",
  email: "larissa.batalha@email.com",
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
    teacher: "Profª Fulana da Silva",
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
]

export const MOCK_GRADES: Record<string, SubjectGrade[]> = {
  s1: [
    { subject: "Língua Portuguesa", b1: 8.5, b2: 9.0, b3: 8.0, b4: null, status: "Em curso" },
    { subject: "Matemática", b1: 7.5, b2: 8.0, b3: 7.0, b4: null, status: "Em curso" },
    { subject: "Ciências", b1: 9.0, b2: 9.5, b3: 9.0, b4: null, status: "Em curso" },
    { subject: "História", b1: 8.0, b2: 7.5, b3: 8.5, b4: null, status: "Em curso" },
    { subject: "Geografia", b1: 9.5, b2: 8.0, b3: 9.0, b4: null, status: "Em curso" },
    { subject: "Artes", b1: 10, b2: 10, b3: 10, b4: null, status: "Em curso" },
    { subject: "Educação Física", b1: 10, b2: 10, b3: 10, b4: null, status: "Em curso" },
    { subject: "Ensino Religioso", b1: 9.0, b2: 9.5, b3: 9.0, b4: null, status: "Em curso" },
  ],
  s2: [
    { subject: "Linguagem", b1: "MB", b2: "MB", b3: "B", b4: null, status: "Em curso" },
    { subject: "Raciocínio Lógico", b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Natureza e Sociedade", b1: "B", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Arte", b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
    { subject: "Psicomotricidade", b1: "MB", b2: "MB", b3: "MB", b4: null, status: "Em curso" },
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
}

export const MOCK_SCHOOL_EVENTS: SchoolEvent[] = [
  { id: "e1", date: "2026-06-05", title: "Dia do Meio Ambiente", description: "Atividades especiais sobre sustentabilidade e meio ambiente na escola.", category: "Evento" },
  { id: "e2", date: "2026-06-10", title: "Reunião de Pais e Mestres", description: "Reunião para acompanhamento do desempenho acadêmico dos alunos no 3º bimestre.", category: "Reunião" },
  { id: "e3", date: "2026-06-13", title: "Festa de São João", description: "Festa junina da escola com danças, quadrilha, comidas típicas e apresentações culturais.", category: "Evento" },
  { id: "e4", date: "2026-06-20", title: "Entrega — Projeto de Ciências", description: "Prazo final para entrega do projeto interdisciplinar de Ciências e Português.", category: "Entrega" },
  { id: "e5", date: "2026-06-25", title: "Avaliação de Língua Portuguesa", description: "Avaliação do 3º bimestre de Língua Portuguesa para o Ensino Fundamental.", category: "Prova" },
  { id: "e6", date: "2026-07-11", title: "Início das Férias Escolares", description: "Início do recesso escolar de julho. Retorno em 28 de julho.", category: "Feriado" },
]

export const MOCK_AGENDA_ENTRIES: Record<string, AgendaEntry[]> = {
  s1: [
    { id: "a1", date: "2026-06-01", category: "Dever de casa", title: "Dever de Matemática entregue", description: "Dionísio entregou o dever de matemática completo e correto. Parabéns pelo empenho!" },
    { id: "a2", date: "2026-05-28", category: "Comportamento", title: "Conversa durante a aula", description: "Dionísio estava conversando durante a explicação. Conversei com ele e ficou combinado que vai prestar mais atenção nas próximas aulas." },
    { id: "a3", date: "2026-05-22", category: "Elogio", title: "Excelente apresentação de Ciências", description: "Dionísio se destacou na apresentação do projeto sobre o sistema solar. Demonstrou domínio do conteúdo e boa comunicação. Muito bem!" },
    { id: "a4", date: "2026-05-15", category: "Dever de casa", title: "Dever de Português incompleto", description: "Dionísio não completou o dever de português. Peço que os responsáveis acompanhem a realização das atividades em casa." },
    { id: "a5", date: "2026-05-08", category: "Participação", title: "Ótima participação na aula de Arte", description: "Dionísio participou ativamente da aula de arte, demonstrando criatividade e entusiasmo nas atividades propostas." },
    { id: "a6", date: "2026-04-25", category: "Observação", title: "Melhora na concentração", description: "Percebi melhora significativa na concentração de Dionísio durante as atividades individuais. Continue assim!" },
  ],
  s2: [
    { id: "a7", date: "2026-06-01", category: "Elogio", title: "Ótimo desenvolvimento na leitura", description: "Hera está demonstrando grande evolução no reconhecimento de letras e sílabas. Parabéns, família!" },
    { id: "a8", date: "2026-05-20", category: "Participação", title: "Participação nas rodas de conversa", description: "Hera participou bem das rodas de conversa desta semana, compartilhando suas experiências com os amiguinhos." },
    { id: "a9", date: "2026-05-10", category: "Observação", title: "Integração com a turma", description: "Hera está se integrando bem com os colegas nas atividades em grupo. Está fazendo novas amizades." },
  ],
}

export const MOCK_NOTICES: Record<string, Notice[]> = {
  s1: [
    { id: "n1", date: "2026-06-01", title: "Reunião de Pais — 10/06 às 19h", content: "Informamos que a reunião de pais e mestres acontecerá no dia 10 de junho, às 19h, no auditório da Unidade Cabo. Sua presença é fundamental para acompanhar o desenvolvimento do seu filho no 3º bimestre. Em caso de impossibilidade, entre em contato com a secretaria para agendar atendimento.", read: false, urgent: false },
    { id: "n2", date: "2026-05-28", title: "⚠️ Cancelamento de aula — 30/05", content: "Comunicamos que as aulas do dia 30/05 (sexta-feira) foram canceladas devido à participação dos professores em formação pedagógica obrigatória. As aulas retornam normalmente na segunda-feira, dia 02/06.", read: false, urgent: true },
    { id: "n3", date: "2026-05-20", title: "Material para a Festa de São João", content: "Pedimos que cada aluno traga até o dia 10/06 os seguintes materiais para a Festa de São João: chapéu de palha (opcional) e roupa típica junina. A escola disponibilizará alguns acessórios para quem não tiver. Contamos com a participação de todos!", read: true, urgent: false },
  ],
  s2: [
    { id: "n4", date: "2026-06-01", title: "Cardápio especial — Junho", content: "O cardápio de junho já está disponível na secretaria e no mural da escola. Destacamos que na semana da Festa Junina (09 a 13/06) haverá merenda especial com comidas típicas regionais.", read: false, urgent: false },
  ],
}

export const MOCK_GALLERY: Record<string, GalleryAlbum[]> = {
  s1: [
    { id: "ga1", date: "2026-05-20", title: "Semana do Meio Ambiente", description: "Atividades, experimentos e projetos sobre sustentabilidade realizados pela turma do 4º Ano A.", itemCount: 12, color: "#22c55e" },
    { id: "ga2", date: "2026-05-10", title: "Seminário: Sistema Solar", description: "Apresentação dos grupos sobre planetas, estrelas e constelações para os colegas do 4º e 5º ano.", itemCount: 8, color: "#6366f1" },
    { id: "ga3", date: "2026-04-20", title: "Dia da Família na Escola", description: "Fotos do evento especial com a participação e integração das famílias com a escola.", itemCount: 24, color: "#f59e0b" },
    { id: "ga4", date: "2026-03-15", title: "Semana de Arte", description: "Exposição dos trabalhos artísticos da turma durante a Semana de Arte da escola.", itemCount: 15, color: "#ec4899" },
  ],
  s2: [
    { id: "ga5", date: "2026-05-28", title: "Recreação e Parque", description: "Fotos das atividades lúdicas, brincadeiras e recreação livre da turma do Infantil B.", itemCount: 6, color: "#0ea5e9" },
    { id: "ga6", date: "2026-05-05", title: "Homenagem às Mamães", description: "Apresentação especial e entrega de lembrancinhas para as mamães da turma.", itemCount: 18, color: "#ec4899" },
  ],
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

const PIX_KEY = "financeiro@coracaodemaria.edu.br"
const BARCODE_S1 = "03399.04584 04004.200002 84440.760002 6 98050000085000"
const BARCODE_S2 = "03399.04584 04004.200002 84440.760002 6 98050000075000"

export const MOCK_BOLETOS: Record<string, Boleto[]> = {
  s1: [
    { id: "b1", title: "Mensalidade — Junho/2026",       description: "Ref. ao mês de junho de 2026 — Unidade Cabo",  value: 850,  dueDate: "2026-06-10", status: "A vencer", barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b2", title: "Material Escolar 2026",           description: "Kit de materiais pedagógicos — Ano letivo 2026", value: 320,  dueDate: "2026-03-15", status: "Vencido",  barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b3", title: "Mensalidade — Maio/2026",         description: "Ref. ao mês de maio de 2026 — Unidade Cabo",   value: 850,  dueDate: "2026-05-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b4", title: "Mensalidade — Abril/2026",        description: "Ref. ao mês de abril de 2026 — Unidade Cabo",  value: 850,  dueDate: "2026-04-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
    { id: "b5", title: "Mensalidade — Março/2026",        description: "Ref. ao mês de março de 2026 — Unidade Cabo",  value: 850,  dueDate: "2026-03-10", status: "Pago",     barcode: BARCODE_S1, pixKey: PIX_KEY },
  ],
  s2: [
    { id: "b6", title: "Mensalidade — Junho/2026",        description: "Ref. ao mês de junho de 2026 — Unidade Gaibu", value: 750,  dueDate: "2026-06-10", status: "A vencer", barcode: BARCODE_S2, pixKey: PIX_KEY },
    { id: "b7", title: "Mensalidade — Maio/2026",         description: "Ref. ao mês de maio de 2026 — Unidade Gaibu",  value: 750,  dueDate: "2026-05-10", status: "Pago",     barcode: BARCODE_S2, pixKey: PIX_KEY },
    { id: "b8", title: "Mensalidade — Abril/2026",        description: "Ref. ao mês de abril de 2026 — Unidade Gaibu", value: 750,  dueDate: "2026-04-10", status: "Pago",     barcode: BARCODE_S2, pixKey: PIX_KEY },
  ],
}
