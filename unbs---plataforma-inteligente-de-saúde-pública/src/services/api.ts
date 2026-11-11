// ==============================================================================
// UNBS - Cliente de API REST (/api/v1)
// ==============================================================================

import {
  Municipality,
  HealthUnit,
  Service,
  User,
  AppointmentSlot,
  Appointment,
  QueueEntry,
  Vaccine,
  VaccineBatch,
  ImmunizationRecord,
  InventoryItem,
  Announcement,
  ServiceRequest,
  AuditLog,
  MunicipalKpis,
  TicketPriority,
} from '../types';

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na requisição HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Usuários / Sessão
  getUsers: () => request<User[]>('/users'),

  // Municípios e Unidades
  getMunicipalities: () => request<Municipality[]>('/municipalities'),
  getHealthUnits: () => request<HealthUnit[]>('/health-units'),
  getServices: (unitId?: string) => request<Service[]>(`/services${unitId ? `?unitId=${unitId}` : ''}`),

  // Agendamentos e Vagas
  getSlots: (unitId?: string, serviceId?: string, date?: string) => {
    const params = new URLSearchParams();
    if (unitId) params.append('unitId', unitId);
    if (serviceId) params.append('serviceId', serviceId);
    if (date) params.append('date', date);
    return request<AppointmentSlot[]>(`/slots?${params.toString()}`);
  },

  getAppointments: (citizenId?: string, unitId?: string, date?: string) => {
    const params = new URLSearchParams();
    if (citizenId) params.append('citizenId', citizenId);
    if (unitId) params.append('unitId', unitId);
    if (date) params.append('date', date);
    return request<Appointment[]>(`/appointments?${params.toString()}`);
  },

  bookAppointment: (data: {
    citizenId: string;
    citizenName: string;
    citizenCpf: string;
    healthUnitId: string;
    serviceId: string;
    slotDate: string;
    slotTime: string;
    professionalId?: string;
  }) => request<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  cancelAppointment: (appointmentId: string, citizenId: string, reason: string) =>
    request<{ message: string }>(`/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ citizenId, reason }),
    }),

  updateAppointmentStatus: (appointmentId: string, status: string, staffUserId: string, notes?: string) =>
    request<Appointment>(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, staffUserId, notes }),
    }),

  // Filas e Painel
  getQueue: (unitId?: string) => request<QueueEntry[]>(`/queues${unitId ? `?unitId=${unitId}` : ''}`),

  generateTicket: (data: {
    healthUnitId: string;
    serviceId: string;
    priorityType: TicketPriority;
    citizenName: string;
    appointmentId?: string;
  }) => request<QueueEntry>('/queues/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  callTicket: (ticketId: string, deskNumber: string, staffUserId: string) =>
    request<QueueEntry>(`/queues/tickets/${ticketId}/call`, {
      method: 'POST',
      body: JSON.stringify({ deskNumber, staffUserId }),
    }),

  // Vacinação
  getVaccines: () => request<Vaccine[]>('/vaccines'),
  getVaccineBatches: (unitId?: string) => request<VaccineBatch[]>(`/vaccines/batches${unitId ? `?unitId=${unitId}` : ''}`),
  getImmunizations: (citizenId?: string, unitId?: string) => {
    const params = new URLSearchParams();
    if (citizenId) params.append('citizenId', citizenId);
    if (unitId) params.append('unitId', unitId);
    return request<ImmunizationRecord[]>(`/immunizations?${params.toString()}`);
  },
  recordVaccination: (data: {
    citizenId: string;
    citizenName: string;
    vaccineId: string;
    batchId: string;
    doseNumber: string;
    healthUnitId: string;
    staffUserId: string;
    notes?: string;
  }) => request<ImmunizationRecord>('/immunizations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Estoque
  getInventory: (unitId?: string) => request<InventoryItem[]>(`/inventory${unitId ? `?unitId=${unitId}` : ''}`),

  // Comunicados
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  createAnnouncement: (data: {
    municipalityId: string;
    healthUnitId?: string;
    title: string;
    content: string;
    category: string;
    isUrgent: boolean;
    publishedByName: string;
  }) => request<Announcement>('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Solicitações e Ouvidoria
  getRequests: (citizenId?: string, unitId?: string) => {
    const params = new URLSearchParams();
    if (citizenId) params.append('citizenId', citizenId);
    if (unitId) params.append('unitId', unitId);
    return request<ServiceRequest[]>(`/requests?${params.toString()}`);
  },
  createRequest: (data: {
    citizenId: string;
    citizenName: string;
    healthUnitId: string;
    category: string;
    title: string;
    description: string;
  }) => request<ServiceRequest>('/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Dashboards & Auditoria
  getMunicipalKpis: () => request<MunicipalKpis>('/dashboard/kpis'),
  getAuditLogs: () => request<AuditLog[]>('/audit'),
};
