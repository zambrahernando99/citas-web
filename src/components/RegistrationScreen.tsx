import React, { useState } from 'react';
import { AuthTokens, login, register, RegistrationRequest } from '../services/authApi';

interface RegistrationScreenProps { onRegistrationSuccess: (tokens: AuthTokens) => void; onLoginRequested: () => void; }
const emptyForm: RegistrationRequest = { givenNames: '', familyNames: '', documentType: '', documentNumber: '', email: '', phone: '', password: '' };

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegistrationSuccess, onLoginRequested }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const update = (field: keyof RegistrationRequest) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null); setIsLoading(true);
    try { await register(form); onRegistrationSuccess(await login({ email: form.email, password: form.password })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'No fue posible crear la cuenta.'); }
    finally { setIsLoading(false); }
  };
  return <div className="min-h-screen bg-[#faf8ff] flex justify-center px-4 py-10"><div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[#e9e7ef]/60 p-8 sm:p-10"><span className="text-xs text-[#002777] font-bold uppercase tracking-wider">Nueva cuenta</span><h1 className="font-headline font-bold text-2xl text-[#1a1b21] mt-1">Crea tu cuenta de paciente</h1><p className="text-sm text-[#444651] mt-2">Todos los datos son obligatorios. El sistema asigna el rol USER automáticamente.</p>{error && <div role="alert" className="mt-5 p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm border border-[#ba1a1a]/20">{error}</div>}<form className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6" onSubmit={handleSubmit}><Field label="Nombres" id="givenNames" value={form.givenNames} onChange={update('givenNames')} autoComplete="given-name" /><Field label="Apellidos" id="familyNames" value={form.familyNames} onChange={update('familyNames')} autoComplete="family-name" /><label className="block text-sm font-semibold text-[#1a1b21]" htmlFor="documentType">Tipo de documento<select id="documentType" value={form.documentType} onChange={update('documentType')} required className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#f4f3fa]"><option value="">Selecciona una opción</option><option value="CC">CC</option><option value="CE">CE</option><option value="TI">TI</option><option value="PASSPORT">Pasaporte</option></select></label><Field label="Número de documento" id="documentNumber" value={form.documentNumber} onChange={update('documentNumber')} /><Field label="Correo electrónico" id="email" type="email" value={form.email} onChange={update('email')} autoComplete="email" /><Field label="Teléfono" id="phone" type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" /><div className="sm:col-span-2"><Field label="Contraseña" id="password" type="password" value={form.password} onChange={update('password')} autoComplete="new-password" /></div><button type="submit" disabled={isLoading} className="sm:col-span-2 py-3.5 px-6 rounded-xl bg-[#002777] text-white font-headline font-semibold disabled:opacity-60">{isLoading ? 'Creando cuenta…' : 'Crear cuenta'}</button></form><p className="text-sm text-[#444651] text-center mt-6">¿Ya tienes cuenta? <button type="button" onClick={onLoginRequested} className="font-semibold text-[#0056c3] hover:text-[#001549]">Inicia sesión</button></p></div></div>;
};

interface FieldProps { label: string; id: keyof RegistrationRequest; type?: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; autoComplete?: string; }
const Field: React.FC<FieldProps> = ({ label, id, type = 'text', value, onChange, autoComplete }) => <label className="block text-sm font-semibold text-[#1a1b21]" htmlFor={id}>{label}<input id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete} required className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#f4f3fa] text-[#1a1b21] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4]" /></label>;
