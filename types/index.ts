export type ItemType =
  | 'email'
  | 'notes'
  | 'meeting'
  | 'assignment'
  | 'bill'
  | 'document'
  | 'other'

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'
export type Priority = 'low' | 'medium' | 'high'
export type EntityKind =
  | 'person'
  | 'organization'
  | 'place'
  | 'document'
  | 'date'
  | 'other'

export interface Deadline {
  description: string
  date: string | null
}

export interface Entity {
  name: string
  type: EntityKind
}

export interface Task {
  id: number
  item_id: number
  title: string
  due_date: string | null
  priority: Priority
  completed: boolean
}

export interface Reply {
  id?: number
  item_id?: number
  professional: string
  friendly: string
  acknowledgement: string
}

export interface Item {
  id: number
  title: string
  type: ItemType
  raw_content: string
  summary: string
  urgency: UrgencyLevel
  deadlines: Deadline[]
  entities: Entity[]
  next_steps: string[]
  created_at: string
  tasks: Task[]
  reply: Reply | null
}

export interface ItemListEntry {
  id: number
  title: string
  type: ItemType
  urgency: UrgencyLevel
  created_at: string
}

export interface AnalysisResult {
  summary: string
  suggestedTitle: string
  urgency: UrgencyLevel
  deadlines: Deadline[]
  entities: Entity[]
  nextSteps: string[]
  tasks: Array<{
    title: string
    dueDate: string | null
    priority: Priority
  }>
  reply: {
    professional: string
    friendly: string
    acknowledgement: string
  }
}
