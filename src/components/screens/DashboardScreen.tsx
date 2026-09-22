import React, { useState } from 'react';
import { Appointment, Screen, UserProfile } from '../../types';

interface DashboardScreenProps {
  userProfile: UserProfile;
  appointments: Appointment[];
  onNavigate: (screen: Screen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userProfile,
  appointments,
  onNavigate
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showIndicacionesModal, setShowIndicacionesModal] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Top Welcome & Hero Bento Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10">
        {/* Welcome & Greeting Card */}
        <div className="lg:col-span-8 bg-[#f4f3fa] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-sm border border-[#e9e7ef]/60">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#002777]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#002777] text-white text-xs font-semibold uppercase tracking-wider">
                Portal Paciente
              </span>
              <span className="text-xs sm:text-sm text-[#444651] font-medium">
                Última conexión: Hoy, 08:15 AM
              </span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#001549] mb-3 tracking-tight">
              Hola, {userProfile.name.split(' ')[0]} {userProfile.name.split(' ')[1] || ''}
            </h1>
            <p className="text-sm sm:text-base text-[#444651] max-w-xl leading-relaxed">
              Bienvenido a tu portal de salud. Aquí puedes gestionar tus citas, consultar tu EPS y revisar el estado de tus solicitudes médicas con total tranquilidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => onNavigate('agendar-cita')}
              className="bg-[#002777] hover:bg-[#006ef4] text-white px-5 sm:px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#002777]/20 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">event_available</span>
              Agendar nueva cita
            </button>
            <button
              onClick={() => onNavigate('mis-citas')}
              className="bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#001549] px-5 sm:px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Ver mis citas
            </button>
          </div>
        </div>

        {/* EPS & Plan Quick Card */}
        <div className="lg:col-span-4 bg-[#002777] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#006ef4]/20 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#7992e6] text-xs font-bold uppercase tracking-wider">
                Afiliación Activa
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </span>
            </div>
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-white mb-1">
              {userProfile.eps}
            </h3>
            <p className="text-sm text-[#b5c4ff]">{userProfile.plan}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="block text-xs text-[#b5c4ff]">Estado</span>
              <span className="text-sm font-semibold text-white">{userProfile.status}</span>
            </div>
            <button
              onClick={() => onNavigate('eps-y-planes')}
              className="text-xs sm:text-sm font-semibold text-[#b5c4ff] hover:text-white underline underline-offset-4 transition-colors"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </section>

      {/* Next Appointment Featured Banner */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
            Próxima Cita Médica
          </h2>
          <span className="text-xs sm:text-sm font-medium text-[#444651]">
            Confirmada y aprobada
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e9e7ef]/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all hover:shadow-md">
          <div className="flex items-start sm:items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#E4F4FB] flex items-center justify-center text-[#0056c3] shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">medical_services</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E4F4FB] text-[#0056c3] text-xs font-semibold">
                  Medicina General
                </span>
                <span className="flex items-center gap-1 text-xs text-[#444651]">
                  <span className="material-symbols-outlined text-[16px] text-[#757682]">location_on</span>
                  Sede Central, Consultorio 402
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg sm:text-xl text-[#001549] mb-1">
                Dra. Sofía Mendoza
              </h3>
              <p className="text-sm text-[#444651]">
                Control general trimestral y revisión de laboratorio.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-[#e9e7ef] gap-4 sm:justify-between">
            <div className="flex items-center gap-2 text-[#001549] font-headline font-bold text-base sm:text-lg">
              <span className="material-symbols-outlined text-[20px] text-[#0056c3]">calendar_today</span>
              14 de Octubre, 09:30 AM
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('mis-citas')}
                className="px-4 py-2 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#1a1b21] text-sm font-semibold transition-colors cursor-pointer"
              >
                Reprogramar
              </button>
              <button
                onClick={() => setShowIndicacionesModal(true)}
                className="px-4 py-2 rounded-xl bg-[#002777] hover:bg-[#006ef4] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Ver indicaciones
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="mb-10">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549] mb-5">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Mis Citas */}
          <div
            onClick={() => onNavigate('mis-citas')}
            className="group bg-[#f4f3fa] hover:bg-[#e9e7ef] p-6 rounded-2xl transition-all shadow-sm border border-[#e9e7ef]/60 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#002777]/10 group-hover:bg-[#002777] group-hover:text-white text-[#002777] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-[#001549] text-base group-hover:text-[#002777] transition-colors">
                  Mis Citas
                </h3>
                <p className="text-xs text-[#444651]">Historial y próximas agendas</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#757682] group-hover:translate-x-1 group-hover:text-[#001549] transition-all">
              arrow_forward
            </span>
          </div>

          {/* Mi Perfil */}
          <div
            onClick={() => onNavigate('mi-perfil')}
            className="group bg-[#f4f3fa] hover:bg-[#e9e7ef] p-6 rounded-2xl transition-all shadow-sm border border-[#e9e7ef]/60 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#002777]/10 group-hover:bg-[#002777] group-hover:text-white text-[#002777] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-[#001549] text-base group-hover:text-[#002777] transition-colors">
                  Mi Perfil
                </h3>
                <p className="text-xs text-[#444651]">Datos personales y contacto</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#757682] group-hover:translate-x-1 group-hover:text-[#001549] transition-all">
              arrow_forward
            </span>
          </div>

          {/* Mis Afiliaciones */}
          <div
            onClick={() => onNavigate('eps-y-planes')}
            className="group bg-[#f4f3fa] hover:bg-[#e9e7ef] p-6 rounded-2xl transition-all shadow-sm border border-[#e9e7ef]/60 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#002777]/10 group-hover:bg-[#002777] group-hover:text-white text-[#002777] flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-[#001549] text-base group-hover:text-[#002777] transition-colors">
                  Mis Afiliaciones
                </h3>
                <p className="text-xs text-[#444651]">EPS Sanitas - Plan Premium</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#757682] group-hover:translate-x-1 group-hover:text-[#001549] transition-all">
              arrow_forward
            </span>
          </div>
        </div>
      </section>

      {/* Recent History Section */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
              Historial Reciente de Citas
            </h2>
            <p className="text-xs sm:text-sm text-[#444651]">
              Consulta el estado actual de tus atenciones médicas recientes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('mis-citas')}
            className="text-[#0056c3] text-sm font-semibold hover:underline text-left"
          >
            Ver historial completo
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#e9e7ef]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#f4f3fa] text-[#444651] text-xs uppercase tracking-wider font-semibold border-b border-[#e9e7ef]">
                  <th className="py-4 px-6">Especialidad / Profesional</th>
                  <th className="py-4 px-6">Fecha y Hora</th>
                  <th className="py-4 px-6">Sede</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9e7ef]/50 text-sm text-[#1a1b21]">
                {/* Row 1 */}
                <tr className="hover:bg-[#f4f3fa]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-headline font-bold text-[#001549]">Medicina General</div>
                    <div className="text-xs text-[#757682]">Dra. Sofía Mendoza</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#1a1b21]">14 Oct 2024</div>
                    <div className="text-xs text-[#757682]">09:30 AM</div>
                  </td>
                  <td className="py-4 px-6 text-[#444651]">Sede Central</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#dce1ff] text-[#00164d]">
                      Aprobada
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedAppointment(appointments[0])}
                      className="p-2 hover:bg-[#e9e7ef] rounded-lg text-[#444651] hover:text-[#001549] transition-colors"
                      title="Ver detalles"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-[#f4f3fa]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-headline font-bold text-[#001549]">Cardiología</div>
                    <div className="text-xs text-[#757682]">Dr. Esteban Restrepo</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#1a1b21]">28 Oct 2024</div>
                    <div className="text-xs text-[#757682]">02:00 PM</div>
                  </td>
                  <td className="py-4 px-6 text-[#444651]">Torre Médica Norte</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ffdbd1] text-[#3a0a00]">
                      Solicitada
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedAppointment(appointments[1])}
                      className="p-2 hover:bg-[#e9e7ef] rounded-lg text-[#444651] hover:text-[#001549] transition-colors"
                      title="Ver detalles"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-[#f4f3fa]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-headline font-bold text-[#001549]">Optometría</div>
                    <div className="text-xs text-[#757682]">Dra. Marcela Gómez</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#1a1b21]">10 Sep 2024</div>
                    <div className="text-xs text-[#757682]">11:15 AM</div>
                  </td>
                  <td className="py-4 px-6 text-[#444651]">Sede Sur</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e3e1e9] text-[#444651]">
                      Completada
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert('Descargando resumen médico en PDF...')}
                      className="p-2 hover:bg-[#e9e7ef] rounded-lg text-[#444651] hover:text-[#001549] transition-colors"
                      title="Descargar resumen"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Indicaciones Modal */}
      {showIndicacionesModal && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E4F4FB] text-[#0056c3] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">medical_information</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#001549]">Indicaciones para la Consulta</h3>
                  <p className="text-xs text-[#757682]">Medicina General • Dra. Sofía Mendoza</p>
                </div>
              </div>
              <button
                onClick={() => setShowIndicacionesModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#444651]">
              <div className="p-3 bg-[#f4f3fa] rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#002777] text-[20px] mt-0.5">badge</span>
                <div>
                  <p className="font-semibold text-[#001549]">Documento de Identidad y Carné</p>
                  <p className="text-xs text-[#757682]">Presentar cédula original y comprobante de afiliación vigente.</p>
                </div>
              </div>
              <div className="p-3 bg-[#f4f3fa] rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#002777] text-[20px] mt-0.5">timer</span>
                <div>
                  <p className="font-semibold text-[#001549]">Llegada Anticipada</p>
                  <p className="text-xs text-[#757682]">Presentarse 15 minutos antes de la hora programada en Consultorio 402.</p>
                </div>
              </div>
              <div className="p-3 bg-[#f4f3fa] rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#002777] text-[20px] mt-0.5">lab_profile</span>
                <div>
                  <p className="font-semibold text-[#001549]">Exámenes Previos</p>
                  <p className="text-xs text-[#757682]">Llevar resultados de laboratorio clínico realizados en los últimos 3 meses.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e9e7ef] flex justify-end">
              <button
                onClick={() => setShowIndicacionesModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#002777]">{selectedAppointment.code || selectedAppointment.id}</span>
                <h3 className="font-headline font-bold text-lg text-[#001549]">{selectedAppointment.specialty}</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Profesional:</span>
                <span className="font-semibold text-[#001549]">{selectedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Fecha y Hora:</span>
                <span className="font-semibold text-[#001549]">{selectedAppointment.date}, {selectedAppointment.time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Sede:</span>
                <span className="font-medium text-[#1a1b21]">{selectedAppointment.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Estado:</span>
                <span className="font-semibold text-[#002777] bg-[#dce1ff] px-2.5 py-0.5 rounded-full text-xs">
                  {selectedAppointment.status}
                </span>
              </div>
              {selectedAppointment.reason && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#757682] block mb-1">Motivo de consulta:</span>
                  <p className="text-xs text-[#444651] bg-[#f4f3fa] p-3 rounded-xl">{selectedAppointment.reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#e9e7ef] flex gap-3">
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  onNavigate('mis-citas');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-sm font-semibold hover:bg-[#e3e1e9] transition-colors"
              >
                Ir a Mis Citas
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
