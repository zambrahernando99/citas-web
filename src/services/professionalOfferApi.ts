import { AuthTokens } from './authApi';
import { apiRequest } from './http';

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

const api = <T>(path: string, tokens: AuthTokens, init?: { method?: string; body?: unknown }) => apiRequest<T>(path, { ...init, tokens });

export const getSpecialties = (tokens: AuthTokens) => api<Specialty[]>('/api/v1/specialties', tokens);
export const getLocations = (tokens: AuthTokens) => api<ClinicLocation[]>('/api/v1/catalogs/locations', tokens);
export const getProfessionals = (tokens: AuthTokens, includeInactive: boolean) =>
  api<Professional[]>(includeInactive ? '/api/v1/admin/professionals' : '/api/v1/professionals', tokens);
export const createProfessional = (tokens: AuthTokens, body: CreateProfessionalRequest) =>
  api<Professional>('/api/v1/admin/professionals', tokens, { method: 'POST', body });
export const assignProfessionalOffer = (tokens: AuthTokens, id: string, specialtyIds: number[], primarySpecialtyId: number, locationIds: number[]) =>
  api<Professional>(`/api/v1/admin/professionals/${id}/assignments`, tokens, {
    method: 'PUT', body: { specialtyIds, primarySpecialtyId, locationIds },
  });
export const setProfessionalActive = (tokens: AuthTokens, id: string, active: boolean) =>
  api<Professional>(`/api/v1/admin/professionals/${id}/active`, tokens, {
    method: 'PATCH', body: { active },
  });
