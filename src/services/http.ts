// Cliente REST único hacia citas-api: base URL por entorno, Bearer y errores problem+json.
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export interface BearerTokens { accessToken: string; }

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) { super(message); this.name = 'ApiError'; }
}

type ApiInit = Omit<RequestInit, 'body'> & { tokens?: BearerTokens | null; body?: unknown };

export async function apiRequest<T>(path: string, { tokens, body, headers, ...init }: ApiInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json, application/problem+json',
        ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No fue posible conectar con el servicio de citas. Intenta de nuevo más tarde.', 0);
  }
  if (response.ok) {
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
  const problem = await response.json().catch(() => null) as { detail?: string; code?: string } | null;
  const fallback = response.status === 401 ? 'Tu sesión expiró. Inicia sesión de nuevo.'
    : response.status === 403 ? 'No tienes permisos para esta acción.' : 'No fue posible completar la solicitud.';
  throw new ApiError(problem?.detail ?? fallback, response.status, problem?.code);
}

export const queryString = (params: Record<string, string | number | undefined | null>) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => [key, String(value)]));
  return query.size ? `?${query}` : '';
};
