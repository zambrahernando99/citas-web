import React, { useState } from 'react';
import { Role } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (selectedRole?: Role) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('carlos.morales@ejemplo.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'error') {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Determine default role based on email or default to USER
      if (email.includes('roberto') || email.includes('doc')) {
        onLoginSuccess('PROFESSIONAL');
      } else if (email.includes('admin') || email.includes('auditoria')) {
        onLoginSuccess('ADMIN');
      } else {
        onLoginSuccess('USER');
      }
    }, 400);
  };

  const handleQuickLogin = (role: Role) => {
    if (role === 'PROFESSIONAL') {
      setEmail('roberto.gomez@hic.salud.org');
    } else if (role === 'ADMIN') {
      setEmail('auditoria@hic.salud.org');
    } else {
      setEmail('carlos.morales@ejemplo.com');
    }
    setPassword('password123');
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background soft geometric blur elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#002777]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0B7CF5]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-[#e9e7ef]/60 p-8 sm:p-10 relative z-10 transition-all">
        {/* Header Icon & Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#002777] flex items-center justify-center text-white font-bold mb-3 shadow-lg shadow-[#002777]/25">
            <span className="material-symbols-outlined text-[32px]">local_hospital</span>
          </div>
          <span className="font-headline font-bold text-2xl text-[#001549] tracking-tight">Portal Citas</span>
          <span className="text-xs font-medium text-[#444651]">Sistema Médico Integral</span>
        </div>

        {/* Welcome Section */}
        <div className="space-y-6">
          <div className="space-y-1.5 text-center">
            <span className="text-xs text-[#002777] font-bold uppercase tracking-wider">Acceso Seguro</span>
            <h2 className="font-headline font-bold text-2xl text-[#1a1b21]">Bienvenido de nuevo</h2>
            <p className="text-sm text-[#444651]">Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>

          {/* Error Banner */}
          {showError && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm animate-shake border border-[#ba1a1a]/20">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <div className="font-medium">Credenciales incorrectas. Verifica tu correo y contraseña.</div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#1a1b21]" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#757682]">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f4f3fa] text-[#1a1b21] placeholder:text-[#757682] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] transition-all text-sm font-normal border border-transparent focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#1a1b21]" htmlFor="password">
                  Contraseña
                </label>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Se ha enviado un enlace de recuperación a su correo electrónico.'); }}
                  className="text-xs text-[#0056c3] hover:text-[#001549] transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#757682]">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#f4f3fa] text-[#1a1b21] placeholder:text-[#757682] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4] transition-all text-sm font-normal border border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#757682] hover:text-[#1a1b21] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#002777] accent-[#002777] cursor-pointer"
                />
                <span className="text-sm text-[#444651]">Recordar en este equipo</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#002777] text-white font-headline font-semibold text-base hover:bg-[#006ef4] transition-all shadow-lg shadow-[#002777]/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{isLoading ? 'Accediendo...' : 'Iniciar sesión'}</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Quick demo roles */}
          <div className="pt-2">
            <p className="text-[11px] uppercase font-bold text-[#757682] tracking-wider text-center mb-2.5">
              Acceso Rápido por Rol (Demostración)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('USER')}
                className="py-2 px-2 rounded-lg bg-[#E4F4FB] hover:bg-[#b5c4ff] text-[#001549] text-xs font-semibold transition-colors text-center"
              >
                👤 Paciente
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('PROFESSIONAL')}
                className="py-2 px-2 rounded-lg bg-[#dce1ff] hover:bg-[#b5c4ff] text-[#00164d] text-xs font-semibold transition-colors text-center"
              >
                🩺 Médico
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="py-2 px-2 rounded-lg bg-[#f4f3fa] hover:bg-[#e9e7ef] text-[#001549] text-xs font-semibold transition-colors text-center"
              >
                🛡️ Auditor
              </button>
            </div>
          </div>

          {/* Footer Register Prompt */}
          <div className="text-center pt-4 border-t border-[#e9e7ef]">
            <p className="text-sm text-[#444651]">
              ¿Aún no tienes una cuenta?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Formulario de registro habilitado.'); }}
                className="text-sm font-semibold text-[#0056c3] hover:text-[#001549] transition-colors ml-1"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
