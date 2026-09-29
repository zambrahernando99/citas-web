import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { Sidebar } from './components/Sidebar';
import { AdminRequestsScreen, BookingScreen, LiveDashboard, MyAppointmentsScreen, ProfessionalAvailabilityScreen, ProfileScreen } from './components/screens/LiveScreens';
import { CatalogScreen } from './components/screens/CatalogScreens';
import { AuthTokens, CurrentUser, currentUser, logout } from './services/authApi';
import { Screen } from './types';

const screensByRole: Record<CurrentUser['roles'][number], Screen[]> = {
  ADMIN: ['inicio', 'solicitudes', 'reprogramaciones', 'profesionales', 'especialidades', 'eps-y-planes'],
  PROFESSIONAL: ['inicio', 'mi-disponibilidad', 'mi-agenda'],
  USER: ['inicio', 'agendar-cita', 'mis-citas', 'mi-perfil', 'eps-y-planes'],
};
const screensFor = (roles: CurrentUser['roles']) => [...new Set(roles.flatMap(role => screensByRole[role]))];

export default function App() {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [screen, setScreen] = useState<Screen>('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileError, setProfileError] = useState('');

  const signedIn = async (issued: AuthTokens) => {
    setTokens(issued); setProfileError('');
    try {
      const profile = await currentUser(issued);
      setUser(profile);
      setScreen('inicio');
    } catch (error) { setTokens(null); setProfileError(error instanceof Error ? error.message : 'No fue posible validar la sesión.'); }
  };
  const signOut = () => {
    if (tokens) void logout(tokens.refreshToken).catch(() => undefined);
    setTokens(null); setUser(null); setAuthView('login'); setScreen('inicio');
  };

  useEffect(() => {
    if (!tokens) return;
    const timer = window.setTimeout(signOut, Math.max(0, tokens.accessTokenExpiresInSeconds - 20) * 1000);
    return () => window.clearTimeout(timer);
  }, [tokens?.accessToken]);

  if (!tokens || !user) return <>{profileError && <div role="alert" className="m-4 rounded-xl bg-[#ffdad6] p-3 text-sm text-[#93000a]">{profileError}</div>}{authView === 'login' ? <LoginScreen onLoginSuccess={(issued) => void signedIn(issued)} onRegisterRequested={() => setAuthView('register')} /> : <RegistrationScreen onRegistrationSuccess={(issued) => void signedIn(issued)} onLoginRequested={() => setAuthView('login')} />}</>;

  const profile = { name: `${user.givenNames} ${user.familyNames}` };
  const navigate = (next: Screen) => { if (screensFor(user.roles).includes(next) || next === 'mi-perfil') setScreen(next); };

  return <div className="min-h-screen bg-[#faf8ff] font-body">
    <Sidebar currentScreen={screen} onNavigate={navigate} userProfile={profile} isOpenMobile={menuOpen} onCloseMobile={() => setMenuOpen(false)} roles={user.roles} />
    <div className="min-h-screen lg:pl-72"><Header currentScreen={screen} activeRole={user.roles.join(' · ')} userProfile={profile} onNavigate={navigate} onOpenMobileMenu={() => setMenuOpen(true)} onLogout={signOut} />
      <main className="mt-16 min-w-0 p-4 pb-12 sm:p-6 lg:p-10">
        {screen === 'inicio' && <LiveDashboard tokens={tokens} user={user} onNavigate={navigate} />}
        {screen === 'agendar-cita' && <BookingScreen tokens={tokens} onBooked={() => setScreen('mis-citas')} />}
        {screen === 'mis-citas' && <MyAppointmentsScreen tokens={tokens} onNavigate={navigate} />}
        {(screen === 'mi-disponibilidad' || screen === 'mi-agenda') && <ProfessionalAvailabilityScreen tokens={tokens} />}
        {(screen === 'solicitudes' || screen === 'reprogramaciones') && <AdminRequestsScreen tokens={tokens} />}
        {screen === 'mi-perfil' && <ProfileScreen tokens={tokens} user={user} onUpdated={setUser} />}
        {(['profesionales','especialidades','eps-y-planes'] as Screen[]).includes(screen) && <CatalogScreen screen={screen} tokens={tokens} isAdmin={user.roles.includes('ADMIN')} />}
      </main>
    </div>
  </div>;
}
