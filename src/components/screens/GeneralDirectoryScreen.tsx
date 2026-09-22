import React from 'react';
import { CLINIC_LOCATIONS, DOCTORS, EPS_PLANS, SPECIALTIES } from '../../data/mockData';
import { Screen, UserProfile } from '../../types';

interface GeneralDirectoryScreenProps {
  screen: Screen;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const GeneralDirectoryScreen: React.FC<GeneralDirectoryScreenProps> = ({
  screen,
  userProfile,
  onNavigate,
}) => {
  if (screen === 'profesionales') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
              Directorio Médico
            </span>
            <span className="text-xs text-[#757682]">• Especialistas Adscritos</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
            Cuerpo Médico y Especialistas
          </h1>
          <p className="text-sm text-[#444651]">
            Consulte nuestro equipo de especialistas certificados, sedes de atención y días disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#e9e7ef] ring-2 ring-[#002777]/20 shrink-0">
                    <img src={doc.avatarUrl} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-[#001549]">{doc.name}</h3>
                    <p className="text-xs font-semibold text-[#0056c3]">{doc.specialty}</p>
                    <div className="flex items-center gap-1 text-xs text-[#757682] mt-1">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span className="font-bold text-[#1a1b21]">{doc.rating}</span>
                      <span>(120+ opiniones)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f3fa] p-3 rounded-xl space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Sede Principal:</span>
                    <span className="font-medium text-[#1a1b21]">{doc.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Días de Atención:</span>
                    <span className="font-semibold text-[#002777]">{doc.availableDays.join(', ')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('agendar-cita')}
                className="w-full py-2.5 rounded-xl bg-[#002777] text-white text-xs font-semibold hover:bg-[#006ef4] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                Agendar con este especialista
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'especialidades') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
              Áreas Clínicas
            </span>
            <span className="text-xs text-[#757682]">• Servicios Habilitados</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
            Especialidades Médicas
          </h1>
          <p className="text-sm text-[#444651]">
            Amplia cobertura hospitalaria y ambulatoria para el cuidado integral de su salud.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIALTIES.map((esp) => (
            <div
              key={esp.id}
              className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E4F4FB] text-[#0056c3] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[24px]">{esp.icon}</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#001549] mb-1">{esp.name}</h3>
                <p className="text-xs text-[#757682] mb-4">
                  {esp.doctorsCount} especialistas activos en la red
                </p>
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-[#f4f3fa] rounded-xl">
                  <span className="text-[#757682]">Tiempo de espera:</span>
                  <span className="font-bold text-[#002777]">{esp.waitTime}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('agendar-cita')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#001549] text-xs font-semibold transition-colors"
              >
                Ver disponibilidad
              </button>
            </div>
          ))}
        </div>
      </div>
    );
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
