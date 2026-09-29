import { AuthTokens } from './authApi';

const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
export interface AvailableSlot { startsAt: string; endsAt: string; }
export interface AppointmentResult { id: string; status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'; specialty: string; startsAt: string; endsAt: string; durationMinutes: number; professionalName: string; patientName?: string; location: string; reason?: string; decisionReason?: string; reschedulePending?: boolean; }
export interface RescheduleResult { id: string; appointmentId: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; startsAt: string; endsAt: string; reason?: string; decisionReason?: string; patientName?: string; specialty?: string; professionalName?: string; location?: string; previousStartsAt?: string; }
export interface AvailabilityBlockResult { id: string; locationId: number; startsAt: string; endsAt: string; }

const api = async <T>(path: string, tokens: AuthTokens, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Accept: 'application/json, application/problem+json', Authorization: `Bearer ${tokens.accessToken}`, ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } });
  if (response.ok) { if (response.status === 204) return undefined as T; const body = await response.text(); return body ? JSON.parse(body) as T : undefined as T; }
  const problem = await response.json().catch(() => null) as { detail?: string } | null;
  throw new Error(problem?.detail ?? 'No fue posible completar la solicitud.');
};

export const findAvailability = (tokens: AuthTokens, query: { locationId: number; specialtyId: number; professionalId: string; date: string }) =>
  api<AvailableSlot[]>(`/api/v1/availability?${new URLSearchParams({ locationId: String(query.locationId), specialtyId: String(query.specialtyId), professionalId: query.professionalId, date: query.date })}`, tokens);
export const reserveAppointment = (tokens: AuthTokens, body: { locationId: number; specialtyId: number; professionalId: string; startsAt: string; reason?: string }) =>
  api<AppointmentResult>('/api/v1/appointments', tokens, { method: 'POST', body: JSON.stringify(body) });
export const requestedAppointments = (tokens: AuthTokens) => api<AppointmentResult[]>('/api/v1/admin/appointments/requested', tokens);
export const decideAppointment = (tokens: AuthTokens, id: string, approve: boolean, reason?: string) =>
  api<AppointmentResult>(`/api/v1/admin/appointments/${id}/decision`, tokens, { method: 'POST', body: JSON.stringify({ approve, reason }) });
export const myAppointments = (tokens: AuthTokens, filters: { status?: string; from?: string; to?: string } = {}) => {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)) as [string, string][]);
  return api<AppointmentResult[]>(`/api/v1/appointments/mine${query.size ? `?${query}` : ''}`, tokens);
};
export const cancelAppointment = (tokens: AuthTokens, id: string, reason?: string) =>
  api<void>(`/api/v1/appointments/${id}`, tokens, { method: 'DELETE', body: JSON.stringify({ reason }) });
export const requestReschedule = (tokens: AuthTokens, id: string, startsAt: string, reason?: string) =>
  api<RescheduleResult>(`/api/v1/appointments/${id}/reschedules`, tokens, { method: 'POST', body: JSON.stringify({ startsAt, reason }) });
export const pendingReschedules = (tokens: AuthTokens) => api<RescheduleResult[]>('/api/v1/admin/reschedules/pending', tokens);
export const decideReschedule = (tokens: AuthTokens, id: string, approve: boolean, reason?: string) =>
  api<RescheduleResult>(`/api/v1/admin/reschedules/${id}/decision`, tokens, { method: 'POST', body: JSON.stringify({ approve, reason }) });
export const professionalBlocks = (tokens: AuthTokens) => api<AvailabilityBlockResult[]>('/api/v1/professional/availability-blocks', tokens);
export const createProfessionalBlock = (tokens: AuthTokens, block: Omit<AvailabilityBlockResult, 'id'>) =>
  api<void>('/api/v1/professional/availability-blocks', tokens, { method: 'POST', body: JSON.stringify(block) });
export const updateProfessionalBlock = (tokens: AuthTokens, id: string, block: Omit<AvailabilityBlockResult, 'id'>) =>
  api<void>(`/api/v1/professional/availability-blocks/${id}`, tokens, { method: 'PUT', body: JSON.stringify(block) });
export const deleteProfessionalBlock = (tokens: AuthTokens, id: string) =>
  api<void>(`/api/v1/professional/availability-blocks/${id}`, tokens, { method: 'DELETE' });
export const professionalAppointments = (tokens: AuthTokens, filters: { from?: string; to?: string; locationId?: number } = {}) => {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)) as [string, string][]);
  return api<AppointmentResult[]>(`/api/v1/professional/appointments${query.size ? `?${query}` : ''}`, tokens);
};
export const closeProfessionalAppointment = (tokens: AuthTokens, id: string, status: 'COMPLETED' | 'NO_SHOW') =>
  api<void>(`/api/v1/professional/appointments/${id}/completion`, tokens, { method: 'PATCH', body: JSON.stringify({ status }) });
