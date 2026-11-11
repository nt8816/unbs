// ==============================================================================
// UNBS - Tipos de Dados e Modelos TypeScript
// ==============================================================================

export type UserRole =
  | 'CITIZEN'
  | 'RECEPTIONIST'
  | 'NURSE'
  | 'DOCTOR'
  | 'NURSE_TECH'
  | 'VACCINATOR'
  | 'DENTIST'
  | 'COMMUNITY_HEALTH_AGENT'
  | 'UBS_MANAGER'
  | 'MUNICIPAL_SECRETARY'
  | 'SUPERADMIN';

export interface Municipality {
  id: string;
  ibgeCode: string;
  name: string;
  state: string;
  isActive: boolean;
}

export interface HealthUnit {
  id: string;
  municipalityId: string;
  cnesCode: string;
  name: string;
  popularName: string;
  neighborhood: string;
  address: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  hasPharmacy: boolean;
  hasVaccineRoom: boolean;
  hasDental: boolean;
  isActive: boolean;
}

export interface Sector {
  id: string;
  healthUnitId: string;
  name: string;
  code: string;
  description?: string;
}

export interface Service {
  id: string;
  healthUnitId: string;
  sectorId: string;
  name: string;
  description: string;
  durationMinutes: number;
  dailyCapacity: number;
  requiresReferral: boolean;
  guidanceNotes?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  cpf: string;
  cns: string;
  birthDate: string;
  phone: string;
  role: UserRole;
  municipalityId: string;
  healthUnitId?: string;
  isActive: boolean;
  councilType?: string;
  councilNumber?: string;
  specialty?: string;
}

export type AppointmentStatus =
  | 'SOLICITADO'
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'CANCELADO'
  | 'REAGENDADO'
  | 'CHECK_IN'
  | 'EM_ATENDIMENTO'
  | 'CONCLUIDO'
  | 'NAO_COMPARECEU';

export interface AppointmentSlot {
  id: string;
  healthUnitId: string;
  serviceId: string;
  professionalId?: string;
  slotDate: string;
  slotTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  protocol: string;
  citizenId: string;
  citizenName: string;
  citizenCpfMasked: string;
  healthUnitId: string;
  healthUnitName: string;
  serviceId: string;
  serviceName: string;
  professionalId?: string;
  professionalName?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  attendanceNotes?: string;
  createdAt: string;
}

export type TicketPriority =
  | 'NORMAL'
  | 'PRIORIDADE_IDOSO_60'
  | 'PRIORIDADE_IDOSO_80'
  | 'PRIORIDADE_GESTANTE_LACTANTE'
  | 'PRIORIDADE_PCD'
  | 'EMERGENCIA_ACOLHIMENTO';

export type QueueStatus =
  | 'AGUARDANDO'
  | 'CHAMADO'
  | 'EM_ATENDIMENTO'
  | 'CONCLUIDO'
  | 'AUSENTE'
  | 'CANCELADO';

export interface QueueEntry {
  id: string;
  healthUnitId: string;
  serviceId: string;
  serviceName: string;
  appointmentId?: string;
  ticketNumber: string;
  priorityType: TicketPriority;
  citizenNameMasked: string;
  status: QueueStatus;
  deskNumber?: string;
  calledAt?: string;
  createdAt: string;
}

export interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  targetDisease: string;
  totalDosesRecommended: number;
  minAgeMonths: number;
}

export interface VaccineBatch {
  id: string;
  vaccineId: string;
  healthUnitId: string;
  batchNumber: string;
  expiryDate: string;
  initialDoses: number;
  remainingDoses: number;
}

export interface ImmunizationRecord {
  id: string;
  protocol: string;
  citizenId: string;
  citizenName: string;
  vaccineId: string;
  vaccineName: string;
  batchNumber: string;
  healthUnitId: string;
  healthUnitName: string;
  doseNumber: string;
  administeredAt: string;
  professionalName: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  healthUnitId: string;
  code: string;
  name: string;
  category: 'MEDICAMENTO' | 'VACINA' | 'MATERIAL_CIRURGICO' | 'EPI';
  unitMeasure: string;
  currentQuantity: number;
  minimumQuantity: number;
  updatedAt: string;
  batches?: { batch: string; expiry: string; qty: number }[];
}

export interface Announcement {
  id: string;
  municipalityId: string;
  healthUnitId?: string;
  title: string;
  content: string;
  category: 'GERAL' | 'VACINACAO' | 'FUNCIONAMENTO' | 'CAMPANHA';
  isUrgent: boolean;
  publishedAt: string;
  publishedByName: string;
}

export interface ServiceRequest {
  id: string;
  protocol: string;
  citizenId: string;
  citizenName: string;
  healthUnitId: string;
  category: 'DUVIDA' | 'ATUALIZACAO_CADASTRO' | 'ELOGIO' | 'RECLAMACAO' | 'SUGESTAO';
  title: string;
  description: string;
  status: 'ABERTO' | 'EM_ANALISE' | 'RESPONDIDO' | 'FINALIZADO';
  responseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  healthUnitId?: string;
  action: string;
  entityName: string;
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface MunicipalKpis {
  totalUnits: number;
  activeProfessionals: number;
  todayAppointments: number;
  completedAppointments: number;
  occupancyRate: number;
  showRate: number;
  waitingQueueCount: number;
  vaccinesAppliedThisMonth: number;
}
