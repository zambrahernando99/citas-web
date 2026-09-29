export type Role = 'USER' | 'PROFESSIONAL' | 'ADMIN';

export type Screen = 
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
  | 'mi-perfil';

export interface UserProfile { name: string; }
