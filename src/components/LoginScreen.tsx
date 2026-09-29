import React, { useState } from 'react';
import { AuthTokens, login, requestPasswordReset, resetPassword } from '../services/authApi';

interface LoginScreenProps {
  onLoginSuccess: (tokens: AuthTokens) => void;
  onRegisterRequested: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRegisterRequested }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      onLoginSuccess(await login({ email, password }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async () => {
    setError(null); setResetMessage(''); setIsLoading(true);
    try { const response = await requestPasswordReset(email); setResetToken(response.debugToken ?? ''); setResetMessage(response.debugToken ? 'Token de desarrollo recibido. Es de un solo uso.' : 'Solicitud recibida. Si este entorno tiene configurado un canal de recuperación, sigue sus instrucciones; el token no se expone desde esta aplicación.'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'No fue posible solicitar la recuperación.'); }
    finally { setIsLoading(false); }
  };
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null); setIsLoading(true);
    try { await resetPassword(resetToken, newPassword); setResetOpen(false); setResetToken(''); setNewPassword(''); setResetMessage('Contraseña actualizada. Ya puedes iniciar sesión.'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'No fue posible actualizar la contraseña.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#002777]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0B7CF5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-[#e9e7ef]/60 p-8 sm:p-10 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#002777] flex items-center justify-center text-white font-bold mb-3 shadow-lg shadow-[#002777]/25"><span className="material-symbols-outlined text-[32px]">local_hospital</span></div>
          <span className="font-headline font-bold text-2xl text-[#001549] tracking-tight">Portal Citas</span>
          <span className="text-xs font-medium text-[#444651]">Sistema Médico Integral</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-1.5 text-center"><span className="text-xs text-[#002777] font-bold uppercase tracking-wider">Acceso seguro</span><h1 className="font-headline font-bold text-2xl text-[#1a1b21]">Bienvenido de nuevo</h1><p className="text-sm text-[#444651]">Ingresa tus credenciales para acceder a tu cuenta.</p></div>
          {error && <div role="alert" className="p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm border border-[#ba1a1a]/20">{error}</div>}
          {resetMessage && <div role="status" className="p-4 rounded-xl bg-[#dcefe4] text-[#006c49] text-sm">{resetMessage}</div>}
          {resetOpen && <form className="space-y-3 rounded-xl bg-[#f4f3fa] p-4" onSubmit={handlePasswordReset}><label className="block text-sm font-semibold">Token de recuperación<input className="mt-1 w-full rounded-lg bg-white p-3" autoComplete="one-time-code" value={resetToken} onChange={e=>setResetToken(e.target.value)} required /></label><label className="block text-sm font-semibold">Nueva contraseña<input className="mt-1 w-full rounded-lg bg-white p-3" type="password" autoComplete="new-password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required /></label><button className="w-full rounded-xl bg-[#002777] p-3 font-semibold text-white" disabled={isLoading}>{isLoading?'Actualizando…':'Cambiar contraseña'}</button></form>}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-1.5 text-sm font-semibold text-[#1a1b21]" htmlFor="email">Correo electrónico<input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#f4f3fa] text-[#1a1b21] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] border border-transparent" /></label>
            <label className="block space-y-1.5 text-sm font-semibold text-[#1a1b21]" htmlFor="password">Contraseña<span className="relative block"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full px-4 py-3 pr-16 rounded-xl bg-[#f4f3fa] text-[#1a1b21] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] border border-transparent" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 px-4 text-xs text-[#0056c3]" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></span></label>
            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-6 rounded-xl bg-[#002777] text-white font-headline font-semibold disabled:opacity-60">{isLoading ? 'Accediendo…' : 'Iniciar sesión'}</button>
          </form>
          <button type="button" disabled={isLoading || !email} onClick={()=>{setResetOpen(true);void handleResetRequest();}} className="w-full text-sm font-semibold text-[#0056c3] disabled:opacity-50">¿Olvidaste tu contraseña?</button>
          <div className="text-center pt-4 border-t border-[#e9e7ef]"><p className="text-sm text-[#444651]">¿Aún no tienes una cuenta? <button type="button" onClick={onRegisterRequested} className="font-semibold text-[#0056c3] hover:text-[#001549]">Regístrate aquí</button></p></div>
        </div>
      </div>
    </div>
  );
};
