import React, { useState } from 'react';
import { Appointment, Screen } from '../../types';

interface MisCitasScreenProps {
  appointments: Appointment[];
  onNavigate: (screen: Screen) => void;
  onUpdateAppointment: (updated: Appointment) => void;
}

export const MisCitasScreen: React.FC<MisCitasScreenProps> = ({
  appointments,
  onNavigate,
  onUpdateAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [reprogramModalAppt, setReprogramModalAppt] = useState<Appointment | null>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<Appointment | null>(null);
  const [summaryModalAppt, setSummaryModalAppt] = useState<Appointment | null>(null);

  // Reprogram modal state
  const [newDateDay, setNewDateDay] = useState('28 Oct 2024');
  const [newTimeSlot, setNewTimeSlot] = useState('02:30 PM');
  const [reprogramReason, setReprogramReason] = useState('Cruce de horario con actividades laborales.');

  // Cancel modal state
  const [cancelReason, setCancelReason] = useState('Incompatibilidad de horario');

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'Todas') return true;
    if (activeTab === 'Aprobada') return appt.status === 'Aprobada';
    if (activeTab === 'Solicitada')
      return appt.status === 'Solicitada' || appt.status === 'Reprogramación Solicitada';
    if (activeTab === 'Completada') return appt.status === 'Completada';
    if (activeTab === 'Cancelada') return appt.status === 'Cancelada';
    return true;
  });

  const handleConfirmReprogram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reprogramModalAppt) return;

    const updated: Appointment = {
      ...reprogramModalAppt,
      date: newDateDay,
      time: newTimeSlot,
      status: 'Reprogramación Solicitada',
      reason: `Reprogramación solicitada: ${reprogramReason}`,
    };

    onUpdateAppointment(updated);
    setReprogramModalAppt(null);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalAppt) return;

    const updated: Appointment = {
      ...cancelModalAppt,
      status: 'Cancelada',
      reason: `Cancelada por el paciente: ${cancelReason}`,
    };

    onUpdateAppointment(updated);
    setCancelModalAppt(null);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#e9e7ef] rounded-full text-xs font-semibold text-[#001549]">
              Portal Paciente
            </span>
            <span className="text-xs text-[#757682]">• Agenda Personal</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
            Mis Citas Médicas
          </h1>
          <p className="text-sm text-[#444651] mt-1">
            Consulte, gestione o solicite la reprogramación de sus citas médicas programadas.
          </p>
        </div>

        <button
          onClick={() => onNavigate('agendar-cita')}
          className="bg-[#002777] hover:bg-[#006ef4] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Agendar Nueva Cita
        </button>
      </div>

      {/* 4 Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002777] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">calendar_today</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Próxima Cita</span>
            <h3 className="font-headline font-bold text-xl text-[#001549]">24 Oct, 10:00 AM</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">Dr. Roberto Gomez</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0056c3] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Citas Aprobadas</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">2 Citas</h3>
            <span className="text-[11px] text-[#444651] font-medium">Confirmadas en sede</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#78C8ED] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">pending</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">En Revisión</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">1 Solicitud</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">En proceso de auditoría</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e9e7ef] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">history</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Historial Total</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">14 Citas</h3>
            <span className="text-[11px] text-[#444651] font-medium">Últimos 12 meses</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e9e7ef] mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['Todas', 'Aprobada', 'Solicitada', 'Completada', 'Cancelada'].map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#002777] text-white shadow-sm'
                    : 'bg-[#f4f3fa] text-[#444651] hover:bg-[#e9e7ef]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#757682] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por médico o especialidad..."
            className="w-full bg-[#f4f3fa] pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm outline-none border border-transparent focus:border-[#002777]"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e9e7ef]">
            <span className="material-symbols-outlined text-4xl text-[#757682] mb-2">event_busy</span>
            <h3 className="font-headline font-bold text-lg text-[#001549]">No se encontraron citas</h3>
            <p className="text-sm text-[#444651] mt-1">
              No hay citas que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Left Info */}
              <div className="flex items-start gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 ${
                    appt.status === 'Aprobada'
                      ? 'bg-[#E4F4FB] text-[#0056c3]'
                      : appt.status === 'Reprogramación Solicitada' || appt.status === 'Solicitada'
                      ? 'bg-[#ffdbd1] text-[#7c2d13]'
                      : appt.status === 'Completada'
                      ? 'bg-[#e3e1e9] text-[#444651]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className="text-[10px] uppercase">{appt.date.split(' ')[1] || 'OCT'}</span>
                  <span className="text-lg leading-tight font-headline">{appt.date.split(' ')[0] || '14'}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#757682]">{appt.id}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        appt.status === 'Aprobada'
                          ? 'bg-[#dce1ff] text-[#00164d]'
                          : appt.status === 'Reprogramación Solicitada'
                          ? 'bg-[#ffdbd1] text-[#7c2d13]'
                          : appt.status === 'Solicitada'
                          ? 'bg-[#ffdbd1] text-[#7c2d13]'
                          : appt.status === 'Completada'
                          ? 'bg-[#e3e1e9] text-[#444651]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {appt.status}
                    </span>
                    <span className="text-xs text-[#757682]">• {appt.time}</span>
                  </div>

                  <h3 className="font-headline font-bold text-lg text-[#001549]">
                    {appt.specialty}
                  </h3>
                  <p className="text-sm font-medium text-[#1a1b21]">{appt.doctorName}</p>
                  <p className="text-xs text-[#757682] mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {appt.location}
                  </p>

                  {appt.reason && (
                    <p className="text-xs text-[#444651] mt-2 italic bg-[#f4f3fa] p-2.5 rounded-xl border border-[#e9e7ef] max-w-xl">
                      "{appt.reason}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-[#e9e7ef]">
                {appt.status === 'Aprobada' && (
                  <>
                    <button
                      onClick={() => setReprogramModalAppt(appt)}
                      className="px-4 py-2.5 rounded-xl bg-[#e9e7ef] hover:bg-[#e3e1e9] text-[#001549] text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">update</span>
                      Reprogramar
                    </button>
                    <button
                      onClick={() => setCancelModalAppt(appt)}
                      className="px-4 py-2.5 rounded-xl bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#93000a] text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      Cancelar Cita
                    </button>
                  </>
                )}

                {appt.status === 'Reprogramación Solicitada' && (
                  <span className="text-xs font-semibold text-[#7c2d13] bg-[#ffdbd1] px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                    En espera de confirmación médica
                  </span>
                )}

                {appt.status === 'Completada' && (
                  <button
                    onClick={() => setSummaryModalAppt(appt)}
                    className="px-4 py-2.5 rounded-xl bg-[#002777] hover:bg-[#006ef4] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    Ver Resumen Médico
                  </button>
                )}

                {appt.status === 'Cancelada' && (
                  <button
                    onClick={() => onNavigate('agendar-cita')}
                    className="px-4 py-2.5 rounded-xl bg-[#002777] hover:bg-[#006ef4] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Reservar Nuevamente
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reprogram Modal */}
      {reprogramModalAppt && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#002777]">Solicitud de Cambio</span>
                <h3 className="font-headline font-bold text-xl text-[#001549]">
                  Reprogramar Cita {reprogramModalAppt.id}
                </h3>
              </div>
              <button
                onClick={() => setReprogramModalAppt(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#f4f3fa] p-3 rounded-xl mb-4 text-xs space-y-1">
              <p>
                <strong>Profesional:</strong> {reprogramModalAppt.doctorName}
              </p>
              <p>
                <strong>Fecha actual:</strong> {reprogramModalAppt.date} a las {reprogramModalAppt.time}
              </p>
              <p>
                <strong>Sede:</strong> {reprogramModalAppt.location}
              </p>
            </div>

            <form onSubmit={handleConfirmReprogram} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">
                  Seleccione la Nueva Fecha
                </label>
                <select
                  value={newDateDay}
                  onChange={(e) => setNewDateDay(e.target.value)}
                  className="w-full bg-[#f4f3fa] text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#e9e7ef] outline-none"
                >
                  <option value="26 Oct 2024">Jueves 26 de Octubre, 2024</option>
                  <option value="28 Oct 2024">Sábado 28 de Octubre, 2024</option>
                  <option value="30 Oct 2024">Lunes 30 de Octubre, 2024</option>
                  <option value="02 Nov 2024">Jueves 02 de Noviembre, 2024</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">
                  Franja Horaria Sugerida
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['08:30 AM', '02:30 PM', '04:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTimeSlot(slot)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                        newTimeSlot === slot
                          ? 'bg-[#002777] text-white border-[#002777]'
                          : 'bg-[#f4f3fa] text-[#444651] border-transparent hover:bg-[#e9e7ef]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">
                  Motivo de la Reprogramación
                </label>
                <textarea
                  rows={2}
                  value={reprogramReason}
                  onChange={(e) => setReprogramReason(e.target.value)}
                  required
                  className="w-full bg-[#f4f3fa] p-3 rounded-xl text-xs outline-none border border-[#e9e7ef]"
                  placeholder="Explique brevemente el motivo..."
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#e9e7ef] flex gap-3">
                <button
                  type="button"
                  onClick={() => setReprogramModalAppt(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold hover:bg-[#e3e1e9]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#002777] text-white text-xs font-semibold hover:bg-[#006ef4] shadow-sm"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalAppt && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e9e7ef] mb-4 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1a1b21]">¿Cancelar Cita Médica?</h3>
                <p className="text-xs text-[#757682]">{cancelModalAppt.id} - {cancelModalAppt.specialty}</p>
              </div>
            </div>

            <p className="text-xs text-[#444651] mb-4 leading-relaxed">
              Esta acción liberará su cupo médico para otros pacientes de la red. Por favor indique el motivo de cancelación:
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">Motivo</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#f4f3fa] text-xs px-3 py-2.5 rounded-xl border border-[#e9e7ef]"
                >
                  <option value="Incompatibilidad de horario laboral">Incompatibilidad de horario laboral</option>
                  <option value="Mejoría en el estado de salud">Mejoría en el estado de salud</option>
                  <option value="Atención en otra sede o institución">Atención en otra sede o institución</option>
                  <option value="Calamidad doméstica imprevista">Calamidad doméstica imprevista</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#e9e7ef] flex gap-3">
                <button
                  type="button"
                  onClick={() => setCancelModalAppt(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold hover:bg-[#e3e1e9]"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-[#93000a] shadow-sm"
                >
                  Sí, Cancelar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Medical Record Modal */}
      {summaryModalAppt && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dce1ff] text-[#00164d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#001549]">Resumen Clínico de Atención</h3>
                  <p className="text-xs text-[#757682]">{summaryModalAppt.id} • Atendida el {summaryModalAppt.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSummaryModalAppt(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#444651]">
              <div className="p-3 bg-[#f4f3fa] rounded-xl space-y-1">
                <p><strong>Médico Tratante:</strong> {summaryModalAppt.doctorName}</p>
                <p><strong>Diagnóstico Principal:</strong> Z00.0 Examen médico general de rutina</p>
                <p><strong>Conducta:</strong> Signos vitales estables. Paciente asintomático. Plan de control anual.</p>
              </div>
              <div className="p-3 bg-[#E4F4FB] rounded-xl border border-[#78C8ED]/30">
                <p className="font-semibold text-[#001549] mb-1">Fórmula Médica y Recomendaciones:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[#444651]">
                  <li>Mantener actividad física aeróbica 150 min/semana.</li>
                  <li>Dieta baja en sodio y control de lípidos.</li>
                  <li>Control de presión arterial en 6 meses.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e9e7ef] flex gap-3">
              <button
                onClick={() => alert('Descargando archivo PDF de la historia clínica...')}
                className="flex-1 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold hover:bg-[#e3e1e9] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Descargar PDF
              </button>
              <button
                onClick={() => setSummaryModalAppt(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#002777] text-white text-xs font-semibold hover:bg-[#006ef4]"
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
