import { useState } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { Sidebar } from './components/Sidebar';
import { AgendarCitaScreen } from './components/screens/AgendarCitaScreen';
import { BrandManualScreen } from './components/screens/BrandManualScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { GeneralDirectoryScreen } from './components/screens/GeneralDirectoryScreen';
import { MiAgendaScreen } from './components/screens/MiAgendaScreen';
import { MisCitasScreen } from './components/screens/MisCitasScreen';
import { SolicitudesScreen } from './components/screens/SolicitudesScreen';
import {
  INITIAL_ADMIN_PROFILE,
  INITIAL_APPOINTMENTS,
  INITIAL_AVAILABILITY_BLOCKS,
  INITIAL_DOCTOR_PROFILE,
  INITIAL_DOCTOR_TODAY_APPOINTMENTS,
  INITIAL_REQUESTS,
  INITIAL_USER_PROFILE,
} from './data/mockData';
import { Appointment, AvailabilityBlock, RequestItem, Role, Screen } from './types';
import { AuthTokens, logout } from './services/authApi';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('USER');
  const [currentScreen, setCurrentScreen] = useState<Screen>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global state across screens
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [doctorTodayAppointments, setDoctorTodayAppointments] = useState<Appointment[]>(
    INITIAL_DOCTOR_TODAY_APPOINTMENTS
  );
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>(
    INITIAL_AVAILABILITY_BLOCKS
  );
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);

  // Active User Profile
  const getCurrentProfile = () => {
    switch (activeRole) {
      case 'PROFESSIONAL':
        return INITIAL_DOCTOR_PROFILE;
      case 'ADMIN':
        return INITIAL_ADMIN_PROFILE;
      case 'USER':
      default:
        return INITIAL_USER_PROFILE;
    }
  };

  const currentProfile = getCurrentProfile();

  const handleRoleChange = (newRole: Role) => {
    setActiveRole(newRole);
    if (newRole === 'PROFESSIONAL') {
      setCurrentScreen('mi-agenda');
    } else if (newRole === 'ADMIN') {
      setCurrentScreen('solicitudes');
    } else {
      setCurrentScreen('inicio');
    }
  };

  const handleLoginSuccess = (issuedTokens: AuthTokens) => {
    setTokens(issuedTokens);
    setIsLoggedIn(true);
    setActiveRole('USER');
    setCurrentScreen('inicio');
  };

  const handleLogout = () => {
    if (tokens) void logout(tokens.refreshToken).catch(() => undefined);
    setTokens(null);
    setIsLoggedIn(false);
    setAuthView('login');
  };

  // Appointment Actions
  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(appointments.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleUpdateDoctorAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setDoctorTodayAppointments(
      doctorTodayAppointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Availability Blocks
  const handleAddBlock = (block: AvailabilityBlock) => {
    const existingIndex = availabilityBlocks.findIndex((b) => b.id === block.id);
    if (existingIndex >= 0) {
      const updated = [...availabilityBlocks];
      updated[existingIndex] = block;
      setAvailabilityBlocks(updated);
    } else {
      setAvailabilityBlocks([...availabilityBlocks, block]);
    }
  };

  const handleDeleteBlock = (id: number) => {
    setAvailabilityBlocks(availabilityBlocks.filter((b) => b.id !== id));
  };

  // Requests / Audit Actions
  const handleRequestStatusUpdate = (
    id: string,
    status: 'aprobada' | 'rechazada',
    rejectReason?: string
  ) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status, rejectReason: rejectReason || r.rejectReason } : r
      )
    );
  };

  // Render Login Screen if not authenticated
  if (!isLoggedIn) {
    return authView === 'login'
      ? <LoginScreen onLoginSuccess={handleLoginSuccess} onRegisterRequested={() => setAuthView('register')} />
      : <RegistrationScreen onRegistrationSuccess={handleLoginSuccess} onLoginRequested={() => setAuthView('login')} />;
  }

  // Render Main Layout with Sidebar and Header
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col font-body">
      {/* Sidebar Navigation */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        userProfile={currentProfile}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header
          currentScreen={currentScreen}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          userProfile={currentProfile}
          onNavigate={setCurrentScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-10 pb-16 overflow-y-auto">
          {currentScreen === 'inicio' && (
            <DashboardScreen
              userProfile={currentProfile}
              appointments={appointments}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'agendar-cita' && (
            <AgendarCitaScreen
              userProfile={currentProfile}
              onAppointmentBooked={handleAppointmentBooked}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'mis-citas' && (
            <MisCitasScreen
              appointments={appointments}
              onNavigate={setCurrentScreen}
              onUpdateAppointment={handleUpdateAppointment}
            />
          )}

          {(currentScreen === 'mi-agenda' || currentScreen === 'mi-disponibilidad') && (
            <MiAgendaScreen
              doctorName={
                activeRole === 'PROFESSIONAL' ? currentProfile.name : 'Dr. Roberto Gomez'
              }
              blocks={availabilityBlocks}
              onAddBlock={handleAddBlock}
              onDeleteBlock={handleDeleteBlock}
              todayAppointments={doctorTodayAppointments}
              onUpdateAppointmentStatus={handleUpdateDoctorAppointmentStatus}
            />
          )}

          {(currentScreen === 'solicitudes' || currentScreen === 'reprogramaciones') && (
            <SolicitudesScreen
              requests={requests}
              onRequestStatusUpdate={handleRequestStatusUpdate}
            />
          )}

          {currentScreen === 'manual-marca' && <BrandManualScreen />}

          {(currentScreen === 'profesionales' ||
            currentScreen === 'especialidades' ||
            currentScreen === 'eps-y-planes' ||
            currentScreen === 'mi-perfil') && (
            <GeneralDirectoryScreen
              screen={currentScreen}
              userProfile={currentProfile}
              onNavigate={setCurrentScreen}
            />
          )}
        </main>
      </div>
    </div>
  );
}
