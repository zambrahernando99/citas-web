import { Appointment, AvailabilityBlock, Doctor, RequestItem, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Carlos Andrés Morales',
  email: 'carlos.morales@ejemplo.com',
  role: 'USER',
  title: 'Paciente Afiliado',
  documentId: 'CC 1.098.342.112',
  eps: 'EPS Sanitas',
  plan: 'Plan Premium Global',
  status: 'Al día / Activo',
  phone: '+57 312 456 7890'
};

export const INITIAL_DOCTOR_PROFILE: UserProfile = {
  id: 'doc-1',
  name: 'Dr. Roberto Gomez',
  email: 'roberto.gomez@hic.salud.org',
  role: 'PROFESSIONAL',
  title: 'Cardiólogo Clínico Especialista',
  documentId: 'MP 74.892.100',
  eps: 'Adscrito HIC & Red Nacional',
  plan: 'Planta Principal',
  status: 'Activo y Disponible',
  phone: '+57 320 890 1234'
};

export const INITIAL_ADMIN_PROFILE: UserProfile = {
  id: 'adm-1',
  name: 'Dra. Claudia V. Silva',
  email: 'auditoria@hic.salud.org',
  role: 'ADMIN',
  title: 'Directora de Auditoría Médica',
  documentId: 'MP 45.120.901',
  eps: 'Comité Central HIC',
  plan: 'Administración Hospitalaria',
  status: 'Sesión Segura',
  phone: '+57 301 234 5678'
};

export const DOCTOR_ROBERTO_PHOTO = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop";
export const DOCTOR_SOFIA_PHOTO = "https://images.unsplash.com/photo-1594824813589-9807584128f7?q=80&w=400&auto=format&fit=crop";

export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Roberto Gomez',
    specialty: 'Cardiología',
    location: 'Sede Central HIC',
    avatarUrl: DOCTOR_ROBERTO_PHOTO,
    rating: 4.9,
    availableDays: ['Lunes', 'Miércoles', 'Viernes']
  },
  {
    id: '2',
    name: 'Dra. Sofía Mendoza',
    specialty: 'Medicina General',
    location: 'Sede Central HIC',
    avatarUrl: DOCTOR_SOFIA_PHOTO,
    rating: 4.8,
    availableDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  },
  {
    id: '3',
    name: 'Dr. Esteban Restrepo',
    specialty: 'Cardiología',
    location: 'Torre Médica Norte',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
    rating: 4.9,
    availableDays: ['Martes', 'Jueves']
  },
  {
    id: '4',
    name: 'Dra. Maria Fernanda Ruiz',
    specialty: 'Cardiología',
    location: 'Sede Central HIC',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    availableDays: ['Miércoles', 'Jueves', 'Viernes']
  },
  {
    id: '5',
    name: 'Dra. Marcela Gómez',
    specialty: 'Optometría',
    location: 'Sede Sur',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop',
    rating: 4.8,
    availableDays: ['Lunes', 'Miércoles']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'CIT-8492',
    specialty: 'Cardiología General',
    doctorName: 'Dr. Roberto Gomez',
    location: 'Hospital Central, Consultorio 402',
    date: '24 Oct 2024',
    time: '10:00 AM',
    durationMinutes: 30,
    status: 'Aprobada',
    patientName: 'Carlos Andrés Morales',
    patientId: 'CC 1.098.342.112',
    eps: 'EPS Sanitas',
    reason: 'Control anual cardiovascular y electrocardiograma preventivo.',
    isAutomaticApproval: true,
    code: 'HIC-849203'
  },
  {
    id: 'CIT-8310',
    specialty: 'Dermatología Clínica',
    doctorName: 'Dra. Elena Ruiz',
    location: 'Sede Norte, Piso 2',
    date: '28 Oct 2024',
    time: '02:30 PM',
    durationMinutes: 30,
    status: 'Reprogramación Solicitada',
    patientName: 'Carlos Andrés Morales',
    patientId: 'CC 1.098.342.112',
    eps: 'EPS Sanitas',
    reason: 'Su solicitud de cambio está siendo evaluada por el profesional.',
    isAutomaticApproval: false,
    code: 'HIC-831092'
  },
  {
    id: 'CIT-7912',
    specialty: 'Medicina General',
    doctorName: 'Dr. Carlos Mendoza',
    location: 'Consultorio 104',
    date: '10 Oct 2024',
    time: '08:00 AM',
    durationMinutes: 30,
    status: 'Completada',
    patientName: 'Carlos Andrés Morales',
    patientId: 'CC 1.098.342.112',
    eps: 'EPS Sanitas',
    reason: 'Control preventivo y lectura de hemograma completo.',
    isAutomaticApproval: true,
    code: 'HIC-791244'
  },
  {
    id: 'CIT-7541',
    specialty: 'Oftalmología',
    doctorName: 'Dra. Sofia Castro',
    location: 'Clínica Visual Sede Central',
    date: '02 Oct 2024',
    time: '04:00 PM',
    durationMinutes: 30,
    status: 'Cancelada',
    patientName: 'Carlos Andrés Morales',
    patientId: 'CC 1.098.342.112',
    eps: 'EPS Sanitas',
    reason: 'Cancelada por cambio de horario laboral.',
    isAutomaticApproval: true,
    code: 'HIC-754180'
  }
];

export const INITIAL_DOCTOR_TODAY_APPOINTMENTS: Appointment[] = [
  {
    id: 'DOC-101',
    specialty: 'Cardiología Clínica',
    doctorName: 'Dr. Roberto Gomez',
    location: 'Sede Principal - Consultorio 402',
    date: 'Hoy (Martes 15 Oct)',
    time: '08:30 AM',
    durationMinutes: 30,
    status: 'Aprobada',
    patientName: 'María Camila Cárdenas',
    patientId: 'CC 1.098.234.561',
    eps: 'EPS Sanitas',
    reason: 'Control de presión arterial y revisión de exámenes de laboratorio de rutina.'
  },
  {
    id: 'DOC-102',
    specialty: 'Cardiología Clínica',
    doctorName: 'Dr. Roberto Gomez',
    location: 'Sede Principal - Consultorio 402',
    date: 'Hoy (Martes 15 Oct)',
    time: '09:15 AM',
    durationMinutes: 30,
    status: 'Aprobada',
    patientName: 'Juan Ricardo Restrepo',
    patientId: 'CC 79.432.112',
    eps: 'Sura EPS',
    reason: 'Dolor lumbar crónico y reajuste de fórmula médica analgésica.'
  },
  {
    id: 'DOC-103',
    specialty: 'Cardiología Clínica',
    doctorName: 'Dr. Roberto Gomez',
    location: 'Sede Principal - Consultorio 402',
    date: 'Hoy (Martes 15 Oct)',
    time: '10:00 AM',
    durationMinutes: 30,
    status: 'Aprobada',
    patientName: 'Ana Lucía Morales',
    patientId: 'CC 52.890.123',
    eps: 'Particular',
    reason: 'Primera vez - Valoración general por cuadro gripal persistente.'
  }
];

export const INITIAL_AVAILABILITY_BLOCKS: AvailabilityBlock[] = [
  {
    id: 1,
    location: 'Sede Principal - Consultorio 402',
    dayOfWeek: 'Lunes a Viernes',
    shiftType: 'Matutino',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    intervalMinutes: 30
  },
  {
    id: 2,
    location: 'Sede Norte - Sala de Procedimientos',
    dayOfWeek: 'Martes y Jueves',
    shiftType: 'Vespertino',
    startTime: '02:00 PM',
    endTime: '07:00 PM',
    intervalMinutes: 45
  }
];

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'REQ-01',
    type: 'REPROGRAMACIÓN',
    patientName: 'María Camila Cárdenas',
    patientId: '1.098.342.112',
    eps: 'EPS Sura',
    specialist: 'Dr. Esteban Restrepo',
    specialty: 'Cardiología Clínica',
    location: 'Sede Norte - Central',
    previousDate: '12 Oct 2024, 09:00 AM',
    newDate: '15 Oct 2024',
    newTime: '11:30 AM',
    timeAgo: 'Hace 18 min',
    reason: 'Cruce de calamidad doméstica imprevista solicitada por el paciente.',
    status: 'pendiente'
  },
  {
    id: 'REQ-02',
    type: 'SOLICITUD ESPECIALIZADA',
    patientName: 'Julián Andrés Ramírez',
    patientId: '79.432.118',
    eps: 'Sanitas Prepago',
    specialist: 'Por asignar',
    specialty: 'Cardiología Avanzada',
    location: 'Sede Norte - Central',
    newDate: '18 Oct 2024',
    newTime: '02:00 PM',
    timeAgo: 'Hace 45 min',
    reason: 'Remisión prioritaria por cuadro de arritmia intermitente evaluada en medicina general.',
    status: 'pendiente'
  },
  {
    id: 'REQ-03',
    type: 'SOLICITUD ESPECIALIZADA',
    patientName: 'Ana Lucía Morales',
    patientId: '52.890.112',
    eps: 'Sura Global',
    specialist: 'Por asignar',
    specialty: 'Neurología Clínica',
    location: 'Sede Sur - Los Pinos',
    newDate: '20 Oct 2024',
    newTime: '08:30 AM',
    timeAgo: 'Hace 1 hora',
    reason: 'Evaluación por cefaleas crónicas resistentes a tratamiento analgésico convencional.',
    status: 'pendiente'
  }
];

export const SPECIALTIES = [
  { id: 'esp-1', name: 'Medicina General', icon: 'stethoscope', doctorsCount: 18, waitTime: 'Inmediata (Auto)' },
  { id: 'esp-2', name: 'Cardiología', icon: 'heart_check', doctorsCount: 7, waitTime: '24-48 hrs' },
  { id: 'esp-3', name: 'Pediatría', icon: 'child_care', doctorsCount: 9, waitTime: '24 hrs' },
  { id: 'esp-4', name: 'Ortopedia y Traumatología', icon: 'bone', doctorsCount: 6, waitTime: '3-5 días' },
  { id: 'esp-5', name: 'Dermatología Clínica', icon: 'healing', doctorsCount: 5, waitTime: '48 hrs' },
  { id: 'esp-6', name: 'Neurología Clínica', icon: 'neurology', doctorsCount: 4, waitTime: '3-4 días' },
  { id: 'esp-7', name: 'Optometría & Oftalmología', icon: 'visibility', doctorsCount: 8, waitTime: '24 hrs' }
];

export const CLINIC_LOCATIONS = [
  { id: 'loc-1', name: 'Sede Central HIC', address: 'Carrera 38 # 52 - 10', consultorios: 24, hours: '06:00 AM - 08:00 PM' },
  { id: 'loc-2', name: 'Sede Norte ICV', address: 'Calle 127 # 19 - 45', consultorios: 18, hours: '07:00 AM - 07:00 PM' },
  { id: 'loc-3', name: 'Sede Sur - Los Pinos', address: 'Avenida 1 de Mayo # 45 - 20', consultorios: 12, hours: '07:00 AM - 06:00 PM' },
  { id: 'loc-4', name: 'Torre Médica Bella Suiza', address: 'Carrera 7 # 128 - 02', consultorios: 30, hours: '06:30 AM - 09:00 PM' }
];

export const EPS_PLANS = [
  { name: 'EPS Sanitas', plan: 'Plan Premium Global', status: 'Activo / Al día', coverage: '100% Red Nacional HIC', copay: '$0 COP' },
  { name: 'Sura EPS', plan: 'Plan Complementario Élite', status: 'Convenio Vigente', coverage: 'Red Especializada HIC', copay: '$4.200 COP' },
  { name: 'Compensar', plan: 'Plan Salud Mayor', status: 'Convenio Vigente', coverage: 'Sedes Ambulatorias', copay: '$5.000 COP' },
  { name: 'Colmédica', plan: 'Medicina Prepagada Total', status: 'Convenio Vigente', coverage: 'Acceso Directo Especialistas', copay: '$0 COP' }
];
