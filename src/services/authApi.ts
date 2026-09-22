export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
}

export interface RegistrationRequest {
  givenNames: string;
  familyNames: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  password: string;
}

const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const request = async <T>(path: string, body: unknown): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, application/problem+json' }, body: JSON.stringify(body) });
  } catch {
    throw new Error('No fue posible conectar con el servicio de citas. Intenta de nuevo más tarde.');
  }
  if (response.ok) return response.status === 204 ? (undefined as T) : (await response.json() as T);
  const problem = await response.json().catch(() => null) as { detail?: string } | null;
  throw new Error(problem?.detail ?? 'No fue posible completar la solicitud.');
};

export const register = (body: RegistrationRequest) => request<{ id: string }>('/api/v1/auth/register', body);
export const login = (body: Pick<RegistrationRequest, 'email' | 'password'>) => request<AuthTokens>('/api/v1/auth/login', body);
export const logout = (refreshToken: string) => request<void>('/api/v1/auth/logout', { refreshToken });
