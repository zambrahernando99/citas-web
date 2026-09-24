import React, { useEffect, useState } from 'react';
import { CLINIC_LOCATIONS, EPS_PLANS } from '../../data/mockData';
import { AuthTokens } from '../../services/authApi';
import {
  ClinicLocation,
  CreateProfessionalRequest,
  Professional,
  Specialty,
  assignProfessionalOffer,
  createProfessional,
  getLocations,
  getProfessionals,
  getSpecialties,
  setProfessionalActive,
} from '../../services/professionalOfferApi';
import { Screen, UserProfile } from '../../types';

interface GeneralDirectoryScreenProps {
  screen: Screen;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  tokens: AuthTokens;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const GeneralDirectoryScreen: React.FC<GeneralDirectoryScreenProps> = ({
  screen,
  userProfile,
  onNavigate,
  tokens,
}) => {
  if (screen === 'profesionales') {
    return <ProfessionalDirectory tokens={tokens} isAdmin={userProfile.role === 'ADMIN'} onNavigate={onNavigate} />;
  }

  if (screen === 'especialidades') {
    return <SpecialtyDirectory tokens={tokens} onNavigate={onNavigate} />;
  }

  if (screen === 'eps-y-planes') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
              Convenios y Coberturas
            </span>
            <span className="text-xs text-[#757682]">• Afiliaciones Activas</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
            EPS y Planes Complementarios
          </h1>
          <p className="text-sm text-[#444651]">
            Consulte convenios vigentes, autorizaciones automáticas y copagos según su plan médico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {EPS_PLANS.map((plan, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline font-bold text-xl text-[#001549]">{plan.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#00164d] text-xs font-bold">
                    {plan.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#0056c3] mb-4">{plan.plan}</p>
                <div className="space-y-2 text-xs text-[#444651] bg-[#f4f3fa] p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Cobertura:</span>
                    <span className="font-medium text-[#1a1b21]">{plan.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Copago Consulta General:</span>
                    <span className="font-bold text-[#002777]">{plan.copay}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e9e7ef] mt-4 flex items-center justify-between">
                <span className="text-xs text-[#757682]">Autorizaciones en línea 24/7</span>
                <button
                  onClick={() => alert(`Certificado de afiliación generado para ${plan.name}`)}
                  className="text-xs text-[#0056c3] font-semibold hover:underline"
                >
                  Descargar Carné / Certificado
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sedes Médicas */}
        <h2 className="font-headline font-bold text-xl text-[#001549] mb-4">Sedes Médicas Habilitadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLINIC_LOCATIONS.map((loc) => (
            <div key={loc.id} className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]">
              <span className="material-symbols-outlined text-[#002777] text-[24px] mb-2 block">
                apartment
              </span>
              <h4 className="font-headline font-bold text-base text-[#001549]">{loc.name}</h4>
              <p className="text-xs text-[#757682] mt-1">{loc.address}</p>
              <div className="mt-3 pt-3 border-t border-[#e9e7ef] text-[11px] text-[#444651] space-y-1">
                <p><strong>Consultorios:</strong> {loc.consultorios}</p>
                <p><strong>Horario:</strong> {loc.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback: Mi Perfil
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
            Información del Usuario
          </span>
          <span className="text-xs text-[#757682]">• Datos Personales</span>
        </div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
          Perfil de Usuario
        </h1>
        <p className="text-sm text-[#444651]">
          Consulte y actualice sus datos de contacto y detalles de afiliación médica.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e7ef] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#e9e7ef]">
          <div className="w-20 h-20 rounded-full bg-[#002777] text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-[#002777]/20">
            <span className="material-symbols-outlined text-[36px]">person</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-headline font-bold text-2xl text-[#001549]">{userProfile.name}</h2>
            <p className="text-sm text-[#757682]">{userProfile.title}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#00164d] font-semibold">
                Rol: {userProfile.role}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e3e1e9] text-[#444651]">
                {userProfile.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-[#f4f3fa] rounded-xl space-y-1">
            <span className="text-xs text-[#757682] font-semibold">Documento de Identidad</span>
            <p className="font-bold text-[#001549]">{userProfile.documentId}</p>
          </div>
          <div className="p-4 bg-[#f4f3fa] rounded-xl space-y-1">
            <span className="text-xs text-[#757682] font-semibold">Correo Electrónico</span>
            <p className="font-bold text-[#001549]">{userProfile.email}</p>
          </div>
          <div className="p-4 bg-[#f4f3fa] rounded-xl space-y-1">
            <span className="text-xs text-[#757682] font-semibold">Teléfono de Contacto</span>
            <p className="font-bold text-[#001549]">{userProfile.phone}</p>
          </div>
          <div className="p-4 bg-[#f4f3fa] rounded-xl space-y-1">
            <span className="text-xs text-[#757682] font-semibold">Entidad Aseguradora (EPS)</span>
            <p className="font-bold text-[#001549]">{userProfile.eps}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e9e7ef] flex justify-end gap-3">
          <button
            onClick={() => alert('Datos de contacto actualizados correctamente.')}
            className="px-6 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] transition-colors shadow-sm"
          >
            Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfessionalDirectory: React.FC<{ tokens: AuthTokens; isAdmin: boolean; onNavigate: (screen: Screen) => void }> = ({ tokens, isAdmin, onNavigate }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateProfessionalRequest>({
    givenNames: '', familyNames: '', documentType: 'CC', documentNumber: '', email: '', phone: '',
    temporaryPassword: '', professionalCode: '', licenseNumber: '',
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [primarySpecialty, setPrimarySpecialty] = useState<number | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [loadedProfessionals, loadedSpecialties, loadedLocations] = await Promise.all([
        getProfessionals(tokens, isAdmin), getSpecialties(tokens), getLocations(tokens),
      ]);
      setProfessionals(loadedProfessionals); setSpecialties(loadedSpecialties); setLocations(loadedLocations);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible cargar la oferta profesional.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [tokens.accessToken, isAdmin]);

  const toggle = (id: number, selected: number[], setSelected: (items: number[]) => void, limit?: number) => {
    if (selected.includes(id)) setSelected(selected.filter((item) => item !== id));
    else if (!limit || selected.length < limit) setSelected([...selected, id]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!primarySpecialty || selectedSpecialties.length === 0 || selectedLocations.length === 0) {
      setError('Seleccione una o más especialidades, una primaria y una o dos sedes.'); return;
    }
    setSaving(true); setError(null);
    try {
      const professional = await createProfessional(tokens, form);
      await assignProfessionalOffer(tokens, professional.id, selectedSpecialties, primarySpecialty, selectedLocations);
      setForm({ givenNames: '', familyNames: '', documentType: 'CC', documentNumber: '', email: '', phone: '', temporaryPassword: '', professionalCode: '', licenseNumber: '' });
      setSelectedSpecialties([]); setPrimarySpecialty(null); setSelectedLocations([]);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible guardar el profesional.');
    } finally { setSaving(false); }
  };

  const changeActive = async (professional: Professional) => {
    setSaving(true); setError(null);
    try {
      const updated = await setProfessionalActive(tokens, professional.id, !professional.active);
      setProfessionals((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'No fue posible cambiar el estado.'); }
    finally { setSaving(false); }
  };

  return <div className="flex flex-col w-full max-w-7xl mx-auto">
    <DirectoryHeading badge="Directorio Médico" subtitle="Especialistas adscritos" title="Cuerpo Médico y Especialistas" description="Consulte el equipo, sus especialidades y sedes habilitadas." />
    {error && <div role="alert" className="mb-6 p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm border border-[#ba1a1a]/20">{error}</div>}
    {isAdmin && <form onSubmit={submit} className="bg-white rounded-2xl p-6 mb-8 border border-[#e9e7ef] shadow-sm">
      <h2 className="font-headline font-bold text-lg text-[#001549]">Registrar profesional sintético</h2>
      <p className="text-xs text-[#757682] mt-1">La contraseña temporal se envía una sola vez y no vuelve a mostrarse.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {(['givenNames', 'familyNames', 'documentNumber', 'email', 'phone', 'professionalCode', 'licenseNumber', 'temporaryPassword'] as const).map((field) => <label key={field} className="text-xs font-semibold text-[#1a1b21] capitalize">{labelFor(field as keyof CreateProfessionalRequest)}<input required type={field === 'email' ? 'email' : field === 'temporaryPassword' ? 'password' : 'text'} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-[#f4f3fa] border border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006ef4]" /></label>)}
        <label className="text-xs font-semibold text-[#1a1b21]">Tipo de documento<select value={form.documentType} onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))} className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-[#f4f3fa]"><option value="CC">CC</option><option value="CE">CE</option></select></label>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-5 text-xs">
        <fieldset><legend className="font-bold text-[#1a1b21] mb-2">Especialidades activas</legend><div className="flex flex-wrap gap-2">{specialties.map((specialty) => <label key={specialty.id} className="px-3 py-2 rounded-xl bg-[#f4f3fa] cursor-pointer"><input type="checkbox" className="mr-1.5" checked={selectedSpecialties.includes(specialty.id)} onChange={() => { toggle(specialty.id, selectedSpecialties, setSelectedSpecialties); if (!selectedSpecialties.includes(specialty.id) && primarySpecialty === null) setPrimarySpecialty(specialty.id); if (selectedSpecialties.includes(specialty.id) && primarySpecialty === specialty.id) setPrimarySpecialty(null); }} />{specialty.name}</label>)}</div>
          <label className="block mt-3 font-bold text-[#1a1b21]">Especialidad primaria<select required value={primarySpecialty ?? ''} onChange={(event) => setPrimarySpecialty(Number(event.target.value))} className="mt-1.5 block w-full px-3 py-2.5 rounded-xl bg-[#f4f3fa]"><option value="">Seleccione una</option>{specialties.filter((item) => selectedSpecialties.includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </fieldset>
        <fieldset><legend className="font-bold text-[#1a1b21] mb-2">Sedes fijas (una o ambas)</legend><div className="flex flex-wrap gap-2">{locations.map((location) => <label key={location.id} className="px-3 py-2 rounded-xl bg-[#f4f3fa] cursor-pointer"><input type="checkbox" className="mr-1.5" checked={selectedLocations.includes(location.id)} onChange={() => toggle(location.id, selectedLocations, setSelectedLocations, 2)} />{location.name}</label>)}</div></fieldset>
      </div>
      <button disabled={saving} className="mt-5 px-5 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold disabled:opacity-60">{saving ? 'Guardando…' : 'Crear y asignar oferta'}</button>
    </form>}
    {loading ? <p className="text-sm text-[#757682]">Cargando profesionales…</p> : professionals.length === 0 ? <p className="text-sm text-[#757682]">No hay profesionales habilitados para mostrar.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{professionals.map((professional) => <div key={professional.id} className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm flex flex-col justify-between"><div><div className="flex items-center gap-4 mb-4"><div className="w-14 h-14 rounded-full bg-[#e4f4fb] text-[#0056c3] flex items-center justify-center"><span className="material-symbols-outlined">medical_services</span></div><div><h3 className="font-headline font-bold text-base text-[#001549]">{professional.givenNames} {professional.familyNames}</h3><p className="text-xs font-semibold text-[#0056c3]">{professional.specialties.find((item) => item.primary)?.specialty.name ?? 'Sin especialidad primaria'}</p><p className="text-xs text-[#757682]">{professional.professionalCode} · {professional.licenseNumber}</p></div></div><div className="bg-[#f4f3fa] p-3 rounded-xl space-y-1.5 text-xs"><p><span className="text-[#757682]">Sedes: </span>{professional.locations.map((location) => location.name).join(', ') || 'Sin asignar'}</p><p><span className="text-[#757682]">Especialidades: </span>{professional.specialties.map((item) => item.specialty.name).join(', ') || 'Sin asignar'}</p><p className={professional.active ? 'text-[#006c49]' : 'text-[#93000a]'}>{professional.active ? 'Activo' : 'Inactivo'}</p></div></div>{isAdmin ? <button disabled={saving} onClick={() => void changeActive(professional)} className="mt-5 w-full py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold disabled:opacity-60">{professional.active ? 'Desactivar profesional' : 'Activar profesional'}</button> : <button onClick={() => onNavigate('agendar-cita')} className="mt-5 w-full py-2.5 rounded-xl bg-[#002777] text-white text-xs font-semibold">Agendar con este especialista</button>}</div>)}</div>}
  </div>;
};

const SpecialtyDirectory: React.FC<{ tokens: AuthTokens; onNavigate: (screen: Screen) => void }> = ({ tokens, onNavigate }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void getSpecialties(tokens).then(setSpecialties).catch((reason) => setError(reason instanceof Error ? reason.message : 'No fue posible cargar las especialidades.')); }, [tokens.accessToken]);
  return <div className="flex flex-col w-full max-w-7xl mx-auto"><DirectoryHeading badge="Áreas Clínicas" subtitle="Servicios habilitados" title="Especialidades Médicas" description="Servicios configurados y actualmente activos en la red." />{error && <div role="alert" className="mb-6 p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm">{error}</div>}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{specialties.map((specialty) => <div key={specialty.id} className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm flex flex-col justify-between"><div><div className="w-12 h-12 rounded-xl bg-[#e4f4fb] text-[#0056c3] flex items-center justify-center mb-4"><span className="material-symbols-outlined">medical_services</span></div><h3 className="font-headline font-bold text-lg text-[#001549] mb-1">{specialty.name}</h3><p className="text-xs text-[#757682] mb-4">Código: {specialty.code}</p><div className="flex items-center justify-between text-xs py-2 px-3 bg-[#f4f3fa] rounded-xl"><span className="text-[#757682]">Duración:</span><span className="font-bold text-[#002777]">{specialty.durationMinutes} min</span></div></div><button onClick={() => onNavigate('agendar-cita')} className="mt-6 w-full py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold">Ver disponibilidad</button></div>)}</div></div>;
};

const DirectoryHeading: React.FC<{ badge: string; subtitle: string; title: string; description: string }> = ({ badge, subtitle, title, description }) => <div className="flex flex-col gap-2 mb-8"><div className="flex items-center gap-2"><span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">{badge}</span><span className="text-xs text-[#757682]">• {subtitle}</span></div><h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">{title}</h1><p className="text-sm text-[#444651]">{description}</p></div>;

const labelFor = (field: keyof CreateProfessionalRequest): string => ({ givenNames: 'Nombres', familyNames: 'Apellidos', documentType: 'Tipo de documento', documentNumber: 'Número de documento', email: 'Correo electrónico', phone: 'Teléfono', temporaryPassword: 'Contraseña temporal', professionalCode: 'Código profesional', licenseNumber: 'Matrícula' }[field]);
