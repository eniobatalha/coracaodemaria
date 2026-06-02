export type Guardian = {
  id: string
  name: string
  email: string
}

export type Student = {
  id: string
  name: string
  gender: "M" | "F"
  grade: string
  class: string
  shift: "Manhã" | "Tarde"
  teacher: string
  unit: "Cabo" | "Gaibu"
  notifications: number
  guardianIds: string[]
  photoPath?: string
  matricula?: string
  etapa?: string
  schoolLevel?: string
}

export type GradeValue = number | string | null

export type SubjectGrade = {
  subject: string
  b1: GradeValue
  b2: GradeValue
  b3: GradeValue
  b4: GradeValue
  status: "Em curso" | "Aprovado" | "Em recuperação" | "Reprovado"
}

export type AttendanceMonth = {
  month: string
  workingDays: number
  absences: number
  justifiedAbsences: number
}

export type SchoolEvent = {
  id: string
  date: string
  title: string
  description: string
  category: "Reunião" | "Feriado" | "Evento" | "Prova" | "Entrega"
}

export type AgendaEntry = {
  id: string
  date: string
  category: "Comportamento" | "Dever de casa" | "Participação" | "Elogio" | "Observação"
  title: string
  description: string
}

export type Notice = {
  id: string
  date: string
  title: string
  content: string
  read: boolean
  urgent: boolean
}

export type GalleryAlbum = {
  id: string
  date: string
  title: string
  description: string
  itemCount: number
  color: string
}

export type Boleto = {
  id: string
  title: string
  description: string
  value: number
  dueDate: string
  status: "Pago" | "A vencer" | "Vencido"
  barcode: string
  pixKey: string
}

export type ChatMessage = {
  id: string
  from: "guardian" | "teacher"
  text: string
  time: string
  date: string
  read: boolean
}

export type GalleryItem = {
  id: string
  type: "photo" | "video"
  src: string
  thumbnail: string
  caption?: string
}
