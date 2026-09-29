import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AppointmentResult } from '../../services/appointmentApi';
import type { AuthTokens } from '../../services/authApi';
import { MyAppointmentsScreen } from './LiveScreens';

const tokens = { accessToken: 'test-access', refreshToken: 'test-refresh' } as AuthTokens;

const appointment = (overrides: Partial<AppointmentResult> = {}): AppointmentResult => ({
  id: 'apt-1', status: 'APPROVED', specialty: 'Especialidad Sintética', startsAt: '2099-05-10T09:00:00', endsAt: '2099-05-10T09:30:00',
  durationMinutes: 30, professionalName: 'Profesional Sintético', location: 'Sede Sintética', professionalId: 'prof-77', specialtyId: 12, locationId: 34,
  reschedulePending: false, ...overrides,
});

const json = (body: unknown, status = 200, type = 'application/json') => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': type } });

type Route = (url: URL, init?: RequestInit) => Response | undefined;
const stubFetch = (route: Route) => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const response = route(url, init);
    if (!response) throw new Error(`Unexpected request ${init?.method ?? 'GET'} ${url.pathname}`);
    return response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('MyAppointmentsScreen', () => {
  it('queries availability with the appointment ids and posts the reschedule, then reloads', async () => {
    let listCalls = 0;
    const fetchMock = stubFetch((url, init) => {
      if (url.pathname === '/api/v1/appointments/mine') { listCalls += 1; return json([appointment({ reschedulePending: listCalls > 1 })]); }
      if (url.pathname === '/api/v1/availability') return json([{ startsAt: '2099-06-01T10:00:00', endsAt: '2099-06-01T10:30:00' }]);
      if (url.pathname === '/api/v1/appointments/apt-1/reschedules' && init?.method === 'POST') return json({ id: 'r-1', appointmentId: 'apt-1', status: 'PENDING', startsAt: '2099-06-01T10:00:00', endsAt: '2099-06-01T10:30:00' }, 201);
      return undefined;
    });
    const user = userEvent.setup();
    render(<MyAppointmentsScreen tokens={tokens} onNavigate={() => undefined} />);

    await user.click(await screen.findByRole('button', { name: 'Solicitar reprogramación' }));
    const dialog = screen.getByRole('dialog');
    const dateInput = dialog.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '2099-06-01');
    await user.click(within(dialog).getByRole('button', { name: 'Buscar horarios' }));
    await user.click(await within(dialog).findByRole('button', { name: '10:00' }));
    await user.type(within(dialog).getByLabelText(/Motivo/), 'Viaje sintético');
    await user.click(within(dialog).getByRole('button', { name: 'Enviar solicitud' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const availabilityUrl = new URL(String(fetchMock.mock.calls.find(([u]) => String(u).includes('/api/v1/availability'))![0]));
    expect(availabilityUrl.searchParams.get('professionalId')).toBe('prof-77');
    expect(availabilityUrl.searchParams.get('specialtyId')).toBe('12');
    expect(availabilityUrl.searchParams.get('locationId')).toBe('34');
    expect(availabilityUrl.searchParams.get('date')).toBe('2099-06-01');
    const post = fetchMock.mock.calls.find(([u]) => String(u).endsWith('/reschedules'))!;
    expect(JSON.parse(String(post[1]!.body))).toEqual({ startsAt: '2099-06-01T10:00:00', reason: 'Viaje sintético' });
    expect(await screen.findByText('Reprogramación pendiente')).toBeInTheDocument();
    expect(listCalls).toBe(2);
  });

  it('shows the pending badge, decision reason and disables actions', async () => {
    stubFetch((url) => url.pathname === '/api/v1/appointments/mine' ? json([appointment({ reschedulePending: true, decisionReason: 'Motivo sintético previo' })]) : undefined);
    render(<MyAppointmentsScreen tokens={tokens} onNavigate={() => undefined} />);
    expect(await screen.findByText('Reprogramación pendiente')).toBeInTheDocument();
    expect(screen.getByText(/Motivo sintético previo/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Solicitar reprogramación' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });

  it('displays the problem detail when the reschedule is rejected with 409', async () => {
    stubFetch((url, init) => {
      if (url.pathname === '/api/v1/appointments/mine') return json([appointment()]);
      if (url.pathname === '/api/v1/availability') return json([{ startsAt: '2099-06-01T10:00:00', endsAt: '2099-06-01T10:30:00' }]);
      if (url.pathname.endsWith('/reschedules') && init?.method === 'POST') return json({ title: 'Conflict', status: 409, detail: 'La franja ya no está disponible.' }, 409, 'application/problem+json');
      return undefined;
    });
    const user = userEvent.setup();
    render(<MyAppointmentsScreen tokens={tokens} onNavigate={() => undefined} />);
    await user.click(await screen.findByRole('button', { name: 'Solicitar reprogramación' }));
    const dialog = screen.getByRole('dialog');
    await user.type(dialog.querySelector('input[type="date"]') as HTMLInputElement, '2099-06-01');
    await user.click(within(dialog).getByRole('button', { name: 'Buscar horarios' }));
    await user.click(await within(dialog).findByRole('button', { name: '10:00' }));
    await user.click(within(dialog).getByRole('button', { name: 'Enviar solicitud' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('La franja ya no está disponible.');
  });

  it('renders the history panel entries', async () => {
    stubFetch((url) => {
      if (url.pathname === '/api/v1/appointments/mine') return json([appointment()]);
      if (url.pathname === '/api/v1/appointments/apt-1/history') return json([
        { status: 'REQUESTED', source: 'USER', changedAt: '2099-05-01T08:15:00', reason: null },
        { status: 'APPROVED', source: 'ADMIN', changedAt: '2099-05-02T11:45:00', reason: 'Aprobación sintética' },
      ]);
      return undefined;
    });
    const user = userEvent.setup();
    render(<MyAppointmentsScreen tokens={tokens} onNavigate={() => undefined} />);
    await user.click(await screen.findByRole('button', { name: 'Historial' }));
    const panel = screen.getByRole('region', { name: 'Historial de la cita' });
    expect(await within(panel).findByText('Solicitada')).toBeInTheDocument();
    expect(within(panel).getByText('Aprobada')).toBeInTheDocument();
    expect(panel).toHaveTextContent('Administración');
    expect(panel).toHaveTextContent('2099-05-02 11:45');
    expect(panel).toHaveTextContent('Aprobación sintética');
  });
});
