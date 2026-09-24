import { AuthTokens } from './authApi';

const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
export interface AvailableSlot { startsAt: string; endsAt: string; }
export interface AppointmentResult { id: string; status: 'REQUESTED' | 'APPROVED' | 'REJECTED'; specialty: string; startsAt: string; endsAt: string; reason?: string; decisionReason?: string; }

const api = async <T>(path: string, tokens: AuthTokens, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { Accept: 'application/json, application/problem+json', Authorization: `Bearer ${tokens.accessToken}`, ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } });
  if (response.ok) return response.status === 204 ? undefined as T : response.json() as Promise<T>;
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
