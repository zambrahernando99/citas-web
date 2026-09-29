import { Role, Screen } from './types';

// Única fuente de verdad de las pantallas permitidas por rol (menú y navegación).
export const screensByRole: Record<Role, Screen[]> = {
  ADMIN: ['inicio', 'solicitudes', 'reprogramaciones', 'profesionales', 'especialidades', 'eps-y-planes', 'mi-perfil'],
  PROFESSIONAL: ['inicio', 'mi-disponibilidad', 'mi-agenda', 'mi-perfil'],
  USER: ['inicio', 'agendar-cita', 'mis-citas', 'eps-y-planes', 'mi-perfil'],
};

export const screensFor = (roles: Role[]): Screen[] => [...new Set(roles.flatMap((role) => screensByRole[role] ?? []))];

export const screenLabels: Record<Screen, string> = {
  inicio: 'Inicio', 'agendar-cita': 'Agendar cita', 'mis-citas': 'Mis citas', 'mi-disponibilidad': 'Mi disponibilidad', 'mi-agenda': 'Mi agenda',
  solicitudes: 'Solicitudes', reprogramaciones: 'Reprogramaciones', profesionales: 'Profesionales', especialidades: 'Especialidades',
  'eps-y-planes': 'EPS y planes', 'mi-perfil': 'Mi perfil',
};

export const menuOrder: Screen[] = ['inicio', 'agendar-cita', 'mis-citas', 'mi-disponibilidad', 'mi-agenda', 'solicitudes', 'reprogramaciones', 'profesionales', 'especialidades', 'eps-y-planes', 'mi-perfil'];

export const appointmentStatusLabels: Record<string, string> = { REQUESTED: 'Solicitada', APPROVED: 'Aprobada', REJECTED: 'Rechazada', CANCELLED: 'Cancelada', COMPLETED: 'Completada', NO_SHOW: 'No asistió' };
