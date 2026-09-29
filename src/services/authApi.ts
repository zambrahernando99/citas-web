import { apiRequest } from './http';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
}
export interface CurrentUser { id: string; givenNames: string; familyNames: string; email: string; phone: string; roles: Array<'USER' | 'PROFESSIONAL' | 'ADMIN'>; }

export interface RegistrationRequest {
  givenNames: string;
  familyNames: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  password: string;
}
const request = <T>(path: string, body: unknown) => apiRequest<T>(path, { method: 'POST', body });

export const register = (body: RegistrationRequest) => request<{ id: string }>('/api/v1/auth/register', body);
export const login = (body: Pick<RegistrationRequest, 'email' | 'password'>) => request<AuthTokens>('/api/v1/auth/login', body);
export const refreshSession = (refreshToken: string) => request<AuthTokens>('/api/v1/auth/refresh', { refreshToken });
export const currentUser = (tokens: AuthTokens) => apiRequest<CurrentUser>('/api/v1/auth/me', { tokens });
export const updateCurrentUser = (tokens: AuthTokens, profile: Pick<CurrentUser, 'givenNames' | 'familyNames' | 'email' | 'phone'>) =>
  apiRequest<CurrentUser>('/api/v1/auth/me', { method: 'PUT', tokens, body: profile });
export const logout = (refreshToken: string) => request<void>('/api/v1/auth/logout', { refreshToken });
export const requestPasswordReset = (email: string) => request<{ debugToken: string | null }>('/api/v1/auth/password-reset-requests', { email });
export const resetPassword = (token: string, newPassword: string) => request<void>('/api/v1/auth/password-resets', { token, newPassword });
