import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AppointmentResult, InboxItem } from '../../services/appointmentApi';
import type { AuthTokens } from '../../services/authApi';
import { Sidebar } from '../Sidebar';
import { AdminRequestsScreen, BookingScreen, ProfessionalAvailabilityScreen } from './LiveScreens';

const tokens = { accessToken: 'test-access', refreshToken: 'test-refresh', accessTokenExpiresInSeconds: 900, refreshTokenExpiresInSeconds: 3600 } as AuthTokens;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
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
const calls = (fetchMock: ReturnType<typeof stubFetch>, method: string, path: string) =>
  fetchMock.mock.calls.filter(([input, init]) => (init?.method ?? 'GET') === method && new URL(String(input)).pathname === path);

const location = { id: 34, code: 'S1', name: 'Sede Sintética', address: 'Calle 0', active: true };
const specialty = (id: number, name: string) => ({ id, code: `E${id}`, name, durationMinutes: 30, active: true });
const professional = { id: 'prof-77', givenNames: 'Ana', familyNames: 'Prueba', email: 'ana@example.test', professionalCode: 'P1', licenseNumber: 'L1', active: true,
  specialties: [{ specialty: specialty(12, 'Medicina General'), primary: true }, { specialty: specialty(13, 'Cardiología'), primary: false }], locations: [location] };

describe('Sidebar', () => {
  const labels = (roles: Array<'USER' | 'PROFESSIONAL' | 'ADMIN'>) => {
    render(<Sidebar currentScreen="inicio" onNavigate={() => undefined} userProfile={{ name: 'Persona Sintética' }} isOpenMobile={false} onCloseMobile={() => undefined} roles={roles} />);
    return screen.getAllByRole('button').map((button) => button.textContent?.replace(/^[a-z_]+/, '').trim());
  };
  it('shows only USER screens', () => {
    expect(labels(['USER'])).toEqual(['Inicio', 'Agendar cita', 'Mis citas', 'EPS y planes', 'Mi perfil']);
  });
  it('shows only PROFESSIONAL screens', () => {
    expect(labels(['PROFESSIONAL'])).toEqual(['Inicio', 'Mi disponibilidad', 'Mi agenda', 'Mi perfil']);
  });
  it('shows only ADMIN screens', () => {
    expect(labels(['ADMIN'])).toEqual(['Inicio', 'Solicitudes', 'Reprogramaciones', 'Profesionales', 'Especialidades', 'EPS y planes', 'Mi perfil']);
  });
});

const inboxItem = (overrides: Partial<InboxItem>): InboxItem => ({ type: 'APPOINTMENT', id: 'apt-1', appointmentId: 'apt-1', status: 'REQUESTED', specialty: 'Cardiología',
  professionalName: 'Ana Prueba', location: 'Sede Sintética', patientName: 'Paciente Uno', startsAt: '2099-05-10T09:00:00', endsAt: '2099-05-10T09:30:00',
  professionalId: 'prof-77', specialtyId: 13, locationId: 34, ...overrides });

describe('AdminRequestsScreen', () => {
  const catalogRoutes: Route = (url) => {
    if (url.pathname === '/api/v1/catalogs/locations') return json([location]);
    if (url.pathname === '/api/v1/admin/professionals') return json([professional]);
    if (url.pathname === '/api/v1/specialties') return json([specialty(13, 'Cardiología')]);
    return undefined;
  };

  it('sends server-side filters in the inbox query string', async () => {
    const fetchMock = stubFetch((url, init) => catalogRoutes(url, init) ?? (url.pathname === '/api/v1/admin/inbox' ? json([]) : undefined));
    render(<AdminRequestsScreen tokens={tokens} initialType="RESCHEDULE" />);
    expect(await screen.findByText('No hay solicitudes pendientes para los filtros seleccionados.')).toBeInTheDocument();
    await screen.findByRole('option', { name: 'Sede Sintética' });
    fireEvent.change(screen.getByLabelText('Sede'), { target: { value: '34' } });
    fireEvent.change(screen.getByLabelText('Profesional'), { target: { value: 'prof-77' } });
    fireEvent.change(screen.getByLabelText('Especialidad'), { target: { value: '13' } });
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2099-05-01' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2099-05-31' } });
    await waitFor(() => {
      const last = new URL(String(calls(fetchMock, 'GET', '/api/v1/admin/inbox').at(-1)?.[0]));
      expect(Object.fromEntries(last.searchParams)).toEqual({ type: 'RESCHEDULE', locationId: '34', professionalId: 'prof-77', specialtyId: '13', from: '2099-05-01', to: '2099-05-31' });
    });
  });

  it('blocks rejection without reason and posts to the right endpoint per type', async () => {
    let decided = false;
    const fetchMock = stubFetch((url, init) => {
      const catalog = catalogRoutes(url, init); if (catalog) return catalog;
      if (url.pathname === '/api/v1/admin/inbox') return json(decided ? [] : [inboxItem({}), inboxItem({ type: 'RESCHEDULE', id: 'rs-9', appointmentId: 'apt-2', patientName: 'Paciente Dos', previousStartsAt: '2099-05-09T08:00:00' })]);
      if (init?.method === 'POST' && (url.pathname === '/api/v1/admin/appointments/apt-1/decision' || url.pathname === '/api/v1/admin/reschedules/rs-9/decision')) return json({});
      return undefined;
    });
    const user = userEvent.setup();
    render(<AdminRequestsScreen tokens={tokens} />);
    const first = await screen.findByRole('article', { name: 'Solicitud Paciente Uno' });
    await user.click(within(first).getByRole('button', { name: 'Rechazar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('El motivo de rechazo es obligatorio.');
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0);

    await user.type(within(first).getByLabelText('Motivo para rechazar'), 'Sin cupo sintético');
    await user.click(within(first).getByRole('button', { name: 'Rechazar' }));
    await waitFor(() => expect(calls(fetchMock, 'POST', '/api/v1/admin/appointments/apt-1/decision')).toHaveLength(1));
    expect(JSON.parse(String(calls(fetchMock, 'POST', '/api/v1/admin/appointments/apt-1/decision')[0][1]?.body))).toEqual({ approve: false, reason: 'Sin cupo sintético' });

    const second = screen.getByRole('article', { name: 'Solicitud Paciente Dos' });
    await user.type(within(second).getByLabelText('Motivo para rechazar'), 'Franja no válida');
    decided = true;
    await user.click(within(second).getByRole('button', { name: 'Rechazar' }));
    await waitFor(() => expect(calls(fetchMock, 'POST', '/api/v1/admin/reschedules/rs-9/decision')).toHaveLength(1));
    expect(JSON.parse(String(calls(fetchMock, 'POST', '/api/v1/admin/reschedules/rs-9/decision')[0][1]?.body))).toEqual({ approve: false, reason: 'Franja no válida' });
    expect(await screen.findByText('No hay solicitudes pendientes para los filtros seleccionados.')).toBeInTheDocument();
  });

  it('shows the backend error when the inbox fails', async () => {
    stubFetch((url, init) => catalogRoutes(url, init) ?? (url.pathname === '/api/v1/admin/inbox' ? json({ detail: 'Error sintético del servicio' }, 500) : undefined));
    render(<AdminRequestsScreen tokens={tokens} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Error sintético del servicio');
  });
});

const agendaItem = (overrides: Partial<AppointmentResult>): AppointmentResult => ({ id: 'apt-past', status: 'APPROVED', specialty: 'Medicina General', startsAt: '2000-01-01T09:00:00',
  endsAt: '2000-01-01T09:30:00', durationMinutes: 30, professionalName: 'Ana Prueba', patientName: 'Paciente Pasado', location: 'Sede Sintética', professionalId: 'prof-77', specialtyId: 12, locationId: 34, ...overrides });

describe('ProfessionalAvailabilityScreen agenda', () => {
  it('disables completion for future appointments and sends PATCH for a past one', async () => {
    const fetchMock = stubFetch((url, init) => {
      if (url.pathname === '/api/v1/catalogs/locations') return json([location]);
      if (url.pathname === '/api/v1/professional/availability-blocks') return json([]);
      if (url.pathname === '/api/v1/professional/appointments') return json([agendaItem({}), agendaItem({ id: 'apt-future', patientName: 'Paciente Futuro', startsAt: '2099-01-01T09:00:00', endsAt: '2099-01-01T09:30:00' })]);
      if (url.pathname === '/api/v1/professional/appointments/apt-past/completion' && init?.method === 'PATCH') return new Response(null, { status: 204 });
      return undefined;
    });
    const user = userEvent.setup();
    render(<ProfessionalAvailabilityScreen tokens={tokens} />);
    const future = (await screen.findByText(/Paciente Futuro/)).closest('article')!;
    expect(within(future).getByRole('button', { name: 'Atendida' })).toBeDisabled();
    expect(within(future).getByRole('button', { name: 'No asistió' })).toBeDisabled();
    expect(within(future).getByText('Podrás cerrar la atención cuando la cita haya terminado.')).toBeInTheDocument();
    const past = screen.getByText(/Paciente Pasado/).closest('article')!;
    await user.click(within(past).getByRole('button', { name: 'Atendida' }));
    await waitFor(() => expect(calls(fetchMock, 'PATCH', '/api/v1/professional/appointments/apt-past/completion')).toHaveLength(1));
    expect(JSON.parse(String(calls(fetchMock, 'PATCH', '/api/v1/professional/appointments/apt-past/completion')[0][1]?.body))).toEqual({ status: 'COMPLETED' });
  });
});

describe('BookingScreen', () => {
  const book = async (specialtyId: number, specialtyName: string, status: 'APPROVED' | 'REQUESTED') => {
    const fetchMock = stubFetch((url, init) => {
      if (url.pathname === '/api/v1/specialties') return json([specialty(12, 'Medicina General'), specialty(13, 'Cardiología')]);
      if (url.pathname === '/api/v1/catalogs/locations') return json([location]);
      if (url.pathname === '/api/v1/professionals') return json([professional]);
      if (url.pathname === '/api/v1/availability') return json([{ startsAt: '2099-06-01T10:00:00', endsAt: '2099-06-01T10:30:00' }]);
      if (url.pathname === '/api/v1/appointments' && init?.method === 'POST') return json(agendaItem({ id: 'new', status, specialtyId }), 201);
      return undefined;
    });
    const onBooked = vi.fn();
    const user = userEvent.setup();
    render(<BookingScreen tokens={tokens} onBooked={onBooked} />);
    await screen.findByRole('option', { name: 'Sede Sintética' });
    await user.selectOptions(screen.getByLabelText('Sede'), '34');
    await user.selectOptions(screen.getByLabelText('Especialidad'), String(specialtyId));
    await user.selectOptions(screen.getByLabelText('Profesional'), 'prof-77');
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2099-06-01' } });
    await user.click(screen.getByRole('button', { name: 'Consultar horarios' }));
    await user.click(await screen.findByRole('button', { name: '10:00' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar cita' }));
    expect(JSON.parse(String(calls(fetchMock, 'POST', '/api/v1/appointments')[0][1]?.body))).toMatchObject({ specialtyId, professionalId: 'prof-77', locationId: 34 });
    expect(onBooked).toHaveBeenCalled();
    expect(specialtyName).toBeTruthy();
  };
  it('general reservation is confirmed immediately (APPROVED)', async () => {
    await book(12, 'Medicina General', 'APPROVED');
    expect(await screen.findByRole('status')).toHaveTextContent('Cita confirmada.');
  });
  it('specialized reservation stays pending approval (REQUESTED)', async () => {
    await book(13, 'Cardiología', 'REQUESTED');
    expect(await screen.findByRole('status')).toHaveTextContent('Solicitud enviada para aprobación.');
  });
});
