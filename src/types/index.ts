// Tipos basados en el schema de Prisma

export type Role = 'ADMIN' | 'TECHNICIAN' | 'CLIENT'
export type ContractType = 'FIXED_RATE' | 'PER_VISIT' | 'HYBRID'
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'WAITING_CLIENT' | 'CLOSED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface User {
  id: string
  email: string
  name?: string
  password: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  rut: string
  email: string
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  name: string
  address: string
  phone?: string
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export interface Equipment {
  id: string
  model: string
  serialNumber: string
  locationId: string
  createdAt: Date
  updatedAt: Date
}

export interface Contract {
  id: string
  clientId: string
  type: ContractType
  startDate: Date
  endDate?: Date
  sla: string // JSON string
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: Priority
  clientId: string
  equipmentId?: string
  assignedToId?: string
  createdById: string
  checklist?: string // JSON string
  createdAt: Date
  updatedAt: Date
}

export interface Part {
  id: string
  name: string
  sku: string
  cost: number
  stock: number
  minStock: number
  createdAt: Date
  updatedAt: Date
}

export interface PartUsage {
  id: string
  ticketId: string
  partId: string
  quantity: number
  createdAt: Date
}

export interface TimeEntry {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Tipos extendidos para la UI
export interface TicketWithRelations extends Ticket {
  client: Client
  equipment?: Equipment
  assignedTo?: User
  createdBy: User
  partsUsed: (PartUsage & { part: Part })[]
}

export interface ClientWithRelations extends Client {
  locations: Location[]
  contracts: Contract[]
  tickets: Ticket[]
}

export interface LocationWithRelations extends Location {
  client: Client
  equipment: Equipment[]
} 