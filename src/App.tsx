import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { Sidebar } from './components/Sidebar';
import { AdminRequestsScreen, BookingScreen, LiveDashboard, MyAppointmentsScreen, ProfessionalAvailabilityScreen, ProfileScreen } from './components/screens/LiveScreens';
import { CatalogScreen } from './components/screens/CatalogScreens';
import { AuthTokens, CurrentUser, currentUser, logout, refreshSession } from './services/authApi';
import { screensFor } from './navigation';
import { Screen } from './types';

export const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró. Inicia sesión de nuevo.';
const REFRESH_MARGIN_SECONDS = 30;

export default function App() {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [screen, setScreen] = useState<Screen>('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [sessionMessage, setSessionMessage] = useState('');
  const tokensRef = useRef<AuthTokens | null>(null);
  tokensRef.current = tokens;

  const signedIn = async (issued: AuthTokens) => {
    setTokens(issued); setProfileError(''); setSessionMessage('');
    try {
      const profile = await currentUser(issued);
      setUser(profile);
      setScreen('inicio');
    } catch (error) { setTokens(null); setProfileError(error instanceof Error ? error.message : 'No fue posible validar la sesión.'); }
  };
  const clearSession = () => { setTokens(null); setUser(null); setAuthView('login'); setScreen('inicio'); };
  const signOut = () => {
    if (tokens) void logout(tokens.refreshToken).catch(() => undefined);
    setSessionMessage(''); clearSession();
  };

  // Renovación proactiva ~30 s antes de que expire el access token; si falla, se cierra la sesión.
  useEffect(() => {
    if (!tokens) return;
    const current = tokens;
    const timer = window.setTimeout(() => {
      void refreshSession(current.refreshToken)
        .then((renewed) => { if (tokensRef.current?.refreshToken === current.refreshToken) setTokens(renewed); })
        .catch(() => { if (tokensRef.current?.refreshToken === current.refreshToken) { clearSession(); setSessionMessage(SESSION_EXPIRED_MESSAGE); } });
    }, Math.max(0, current.accessTokenExpiresInSeconds - REFRESH_MARGIN_SECONDS) * 1000);
    return () => window.clearTimeout(timer);
  }, [tokens?.accessToken]);

  if (!tokens || !user) return <>{sessionMessage && authView === 'login' && <div role="alert" className="m-4 rounded-xl bg-[#ffdad6] p-3 text-sm text-[#93000a]">{sessionMessage}</div>}{profileError && <div role="alert" className="m-4 rounded-xl bg-[#ffdad6] p-3 text-sm text-[#93000a]">{profileError}</div>}{authView === 'login' ? <LoginScreen onLoginSuccess={(issued) => void signedIn(issued)} onRegisterRequested={() => setAuthView('register')} /> : <RegistrationScreen onRegistrationSuccess={(issued) => void signedIn(issued)} onLoginRequested={() => setAuthView('login')} />}</>;

  const profile = { name: `${user.givenNames} ${user.familyNames}` };
  const allowed = screensFor(user.roles);
  const navigate = (next: Screen) => { if (allowed.includes(next)) setScreen(next); };
  const visible = (candidate: Screen) => screen === candidate && allowed.includes(candidate);

  return <div className="min-h-screen bg-[#faf8ff] font-body">
    <Sidebar currentScreen={screen} onNavigate={navigate} userProfile={profile} isOpenMobile={menuOpen} onCloseMobile={() => setMenuOpen(false)} roles={user.roles} />
    <div className="min-h-screen lg:pl-72"><Header currentScreen={screen} activeRole={user.roles.join(' · ')} userProfile={profile} onNavigate={navigate} onOpenMobileMenu={() => setMenuOpen(true)} onLogout={signOut} />
      <main className="mt-16 min-w-0 p-4 pb-12 sm:p-6 lg:p-10">
        {visible('inicio') && <LiveDashboard tokens={tokens} user={user} onNavigate={navigate} />}
        {visible('agendar-cita') && <BookingScreen tokens={tokens} onBooked={() => setScreen('mis-citas')} />}
        {visible('mis-citas') && <MyAppointmentsScreen tokens={tokens} onNavigate={navigate} />}
        {(visible('mi-disponibilidad') || visible('mi-agenda')) && <ProfessionalAvailabilityScreen tokens={tokens} />}
        {visible('solicitudes') && <AdminRequestsScreen key="solicitudes" tokens={tokens} initialType="APPOINTMENT" />}
        {visible('reprogramaciones') && <AdminRequestsScreen key="reprogramaciones" tokens={tokens} initialType="RESCHEDULE" />}
        {visible('mi-perfil') && <ProfileScreen tokens={tokens} user={user} onUpdated={setUser} />}
        {(['profesionales','especialidades','eps-y-planes'] as Screen[]).some(visible) && <CatalogScreen screen={screen} tokens={tokens} isAdmin={user.roles.includes('ADMIN')} />}
      </main>
    </div>
  </div>;
}
