import { AuthTokens } from './authApi';
import { apiRequest, queryString } from './http';

export type AppointmentStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export interface AvailableSlot { startsAt: string; endsAt: string; }
export interface AppointmentResult { id: string; status: AppointmentStatus; specialty: string; startsAt: string; endsAt: string; durationMinutes: number; professionalName: string; patientName?: string; location: string; reason?: string; decisionReason?: string; reschedulePending?: boolean; professionalId: string; specialtyId: number; locationId: number; }
export interface RescheduleResult { id: string; appointmentId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; startsAt: string; endsAt: string; reason?: string; decisionReason?: string; patientName?: string; specialty?: string; professionalName?: string; location?: string; previousStartsAt?: string; }
export interface AvailabilityBlockResult { id: string; locationId: number; startsAt: string; endsAt: string; }
export interface StatusChange { status: AppointmentStatus; source: 'USER' | 'ADMIN' | 'SYSTEM'; changedAt: string; reason?: string | null; }
export type InboxType = 'APPOINTMENT' | 'RESCHEDULE';
export interface InboxItem { type: InboxType; id: string; appointmentId: string; status: string; specialty: string; professionalName: string; location: string; patientName: string; startsAt: string; endsAt: string; previousStartsAt?: string | null; reason?: string | null; professionalId: string; specialtyId: number; locationId: number; }
export interface InboxFilters { type?: InboxType | ''; locationId?: number; professionalId?: string; specialtyId?: number; from?: string; to?: string; }

const api = <T>(path: string, tokens: AuthTokens, init?: { method?: string; body?: unknown }) => apiRequest<T>(path, { ...init, tokens });

export const findAvailability = (tokens: AuthTokens, query: { locationId: number; specialtyId: number; professionalId: string; date: string }) =>
  api<AvailableSlot[]>(`/api/v1/availability${queryString(query)}`, tokens);
export const reserveAppointment = (tokens: AuthTokens, body: { locationId: number; specialtyId: number; professionalId: string; startsAt: string; reason?: string }) =>
  api<AppointmentResult>('/api/v1/appointments', tokens, { method: 'POST', body });
export const decideAppointment = (tokens: AuthTokens, id: string, approve: boolean, reason?: string) =>
  api<AppointmentResult>(`/api/v1/admin/appointments/${id}/decision`, tokens, { method: 'POST', body: { approve, reason } });
export const myAppointments = (tokens: AuthTokens, filters: { status?: string; from?: string; to?: string } = {}) =>
  api<AppointmentResult[]>(`/api/v1/appointments/mine${queryString(filters)}`, tokens);
export const cancelAppointment = (tokens: AuthTokens, id: string, reason?: string) =>
  api<void>(`/api/v1/appointments/${id}`, tokens, { method: 'DELETE', body: { reason } });
export const requestReschedule = (tokens: AuthTokens, id: string, startsAt: string, reason?: string) =>
  api<RescheduleResult>(`/api/v1/appointments/${id}/reschedules`, tokens, { method: 'POST', body: { startsAt, reason } });
export const decideReschedule = (tokens: AuthTokens, id: string, approve: boolean, reason?: string) =>
  api<RescheduleResult>(`/api/v1/admin/reschedules/${id}/decision`, tokens, { method: 'POST', body: { approve, reason } });
export const appointmentHistory = (tokens: AuthTokens, id: string) => api<StatusChange[]>(`/api/v1/appointments/${id}/history`, tokens);
export const adminInbox = (tokens: AuthTokens, filters: InboxFilters = {}) => api<InboxItem[]>(`/api/v1/admin/inbox${queryString({ ...filters })}`, tokens);
export const professionalBlocks = (tokens: AuthTokens) => api<AvailabilityBlockResult[]>('/api/v1/professional/availability-blocks', tokens);
export const createProfessionalBlock = (tokens: AuthTokens, block: Omit<AvailabilityBlockResult, 'id'>) =>
  api<void>('/api/v1/professional/availability-blocks', tokens, { method: 'POST', body: block });
export const updateProfessionalBlock = (tokens: AuthTokens, id: string, block: Omit<AvailabilityBlockResult, 'id'>) =>
  api<void>(`/api/v1/professional/availability-blocks/${id}`, tokens, { method: 'PUT', body: block });
export const deleteProfessionalBlock = (tokens: AuthTokens, id: string) =>
  api<void>(`/api/v1/professional/availability-blocks/${id}`, tokens, { method: 'DELETE' });
export const professionalAppointments = (tokens: AuthTokens, filters: { from?: string; to?: string; locationId?: number } = {}) =>
  api<AppointmentResult[]>(`/api/v1/professional/appointments${queryString(filters)}`, tokens);
export const closeProfessionalAppointment = (tokens: AuthTokens, id: string, status: 'COMPLETED' | 'NO_SHOW') =>
  api<void>(`/api/v1/professional/appointments/${id}/completion`, tokens, { method: 'PATCH', body: { status } });
