import { AuthTokens } from './authApi';

export interface Specialty {
  id: number;
  code: string;
  name: string;
  durationMinutes: number;
  active: boolean;
}

export interface ClinicLocation {
  id: number;
  code: string;
  name: string;
  address: string;
  active: boolean;
}

export interface Professional {
  id: string;
  givenNames: string;
  familyNames: string;
  email: string;
  professionalCode: string;
  licenseNumber: string;
  active: boolean;
  specialties: Array<{ specialty: Specialty; primary: boolean }>;
  locations: ClinicLocation[];
}

export interface CreateProfessionalRequest {
  givenNames: string;
  familyNames: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  temporaryPassword: string;
  professionalCode: string;
  licenseNumber: string;
}

const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const api = async <T>(path: string, tokens: AuthTokens, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json, application/problem+json',
        Authorization: `Bearer ${tokens.accessToken}`,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('No fue posible conectar con el servicio de citas. Intenta de nuevo más tarde.');
  }
  if (response.ok) return response.status === 204 ? (undefined as T) : (await response.json() as T);
  const problem = await response.json().catch(() => null) as { detail?: string } | null;
  throw new Error(problem?.detail ?? 'No fue posible completar la solicitud.');
};

export const getSpecialties = (tokens: AuthTokens) => api<Specialty[]>('/api/v1/specialties', tokens);
export const getLocations = (tokens: AuthTokens) => api<ClinicLocation[]>('/api/v1/catalogs/locations', tokens);
export const getProfessionals = (tokens: AuthTokens, includeInactive: boolean) =>
  api<Professional[]>(includeInactive ? '/api/v1/admin/professionals' : '/api/v1/professionals', tokens);
export const createProfessional = (tokens: AuthTokens, body: CreateProfessionalRequest) =>
  api<Professional>('/api/v1/admin/professionals', tokens, { method: 'POST', body: JSON.stringify(body) });
export const assignProfessionalOffer = (tokens: AuthTokens, id: string, specialtyIds: number[], primarySpecialtyId: number, locationIds: number[]) =>
  api<Professional>(`/api/v1/admin/professionals/${id}/assignments`, tokens, {
    method: 'PUT', body: JSON.stringify({ specialtyIds, primarySpecialtyId, locationIds }),
  });
export const setProfessionalActive = (tokens: AuthTokens, id: string, active: boolean) =>
  api<Professional>(`/api/v1/admin/professionals/${id}/active`, tokens, {
    method: 'PATCH', body: JSON.stringify({ active }),
  });
