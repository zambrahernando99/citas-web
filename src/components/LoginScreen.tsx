import React, { useState } from 'react';
import { AuthTokens, login } from '../services/authApi';

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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-1.5 text-sm font-semibold text-[#1a1b21]" htmlFor="email">Correo electrónico<input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#f4f3fa] text-[#1a1b21] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] border border-transparent" /></label>
            <label className="block space-y-1.5 text-sm font-semibold text-[#1a1b21]" htmlFor="password">Contraseña<span className="relative block"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full px-4 py-3 pr-16 rounded-xl bg-[#f4f3fa] text-[#1a1b21] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] border border-transparent" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 px-4 text-xs text-[#0056c3]" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></span></label>
            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-6 rounded-xl bg-[#002777] text-white font-headline font-semibold disabled:opacity-60">{isLoading ? 'Accediendo…' : 'Iniciar sesión'}</button>
          </form>
          <div className="text-center pt-4 border-t border-[#e9e7ef]"><p className="text-sm text-[#444651]">¿Aún no tienes una cuenta? <button type="button" onClick={onRegisterRequested} className="font-semibold text-[#0056c3] hover:text-[#001549]">Regístrate aquí</button></p></div>
        </div>
      </div>
    </div>
  );
};
