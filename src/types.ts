export type Role = 'USER' | 'PROFESSIONAL' | 'ADMIN';

export type Screen = 
  | 'login'
  | 'inicio'
  | 'agendar-cita'
  | 'mis-citas'
  | 'mi-disponibilidad'
  | 'mi-agenda'
  | 'solicitudes'
  | 'reprogramaciones'
  | 'profesionales'
  | 'especialidades'
  | 'eps-y-planes'
  | 'mi-perfil'
  | 'manual-marca';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  documentId: string;
  eps: string;
  plan: string;
  status: string;
  phone: string;
}

export type AppointmentStatus = 
  | 'Aprobada'
  | 'Solicitada'
  | 'Completada'
  | 'Cancelada'
  | 'Reprogramación Solicitada'
  | 'No Asistió';

export interface Appointment {
  id: string;
  specialty: string;
  doctorName: string;
  location: string;
  date: string; // ISO or readable e.g. "14 Oct 2024"
  time: string; // "09:30 AM"
  durationMinutes: number;
  status: AppointmentStatus;
  patientName: string;
  patientId: string;
  eps: string;
  reason?: string;
  isAutomaticApproval?: boolean;
  code?: string;
  consultingRoom?: string;
  notes?: string;
}

export interface AvailabilityBlock {
  id: number;
  location: string;
  dayOfWeek: string;
  shiftType: 'Matutino' | 'Vespertino' | 'Jornada Completa';
  startTime: string;
  endTime: string;
  intervalMinutes: number;
}

export interface RequestItem {
  id: string;
  type: 'REPROGRAMACIÓN' | 'SOLICITUD ESPECIALIZADA';
  patientName: string;
  patientId: string;
  eps: string;
  specialist: string;
  specialty: string;
  location: string;
  previousDate?: string;
  newDate: string;
  newTime: string;
  timeAgo: string;
  reason: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  rejectReason?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatarUrl?: string;
  rating: number;
  availableDays: string[];
}
