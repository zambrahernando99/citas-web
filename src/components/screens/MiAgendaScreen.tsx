import React, { useState } from 'react';
import { Appointment, AvailabilityBlock } from '../../types';

interface MiAgendaScreenProps {
  doctorName?: string;
  blocks: AvailabilityBlock[];
  onAddBlock: (block: AvailabilityBlock) => void;
  onDeleteBlock: (id: number) => void;
  todayAppointments: Appointment[];
  onUpdateAppointmentStatus: (id: string, newStatus: Appointment['status']) => void;
}

export const MiAgendaScreen: React.FC<MiAgendaScreenProps> = ({
  doctorName = 'Dr. Roberto Gomez',
  blocks,
  onAddBlock,
  onDeleteBlock,
  todayAppointments,
  onUpdateAppointmentStatus,
}) => {
  const [selectedDay, setSelectedDay] = useState('Martes');
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AvailabilityBlock | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    location: 'Sede Principal - Consultorio 402',
    dayOfWeek: 'Lunes a Viernes',
    shiftType: 'Matutino' as 'Matutino' | 'Vespertino' | 'Jornada Completa',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    intervalMinutes: 30,
  });

  const weekDays = [
    { name: 'Lunes', date: '14 Oct', count: 6 },
    { name: 'Martes', date: '15 Oct', count: 8, active: true },
    { name: 'Miércoles', date: '16 Oct', count: 7 },
    { name: 'Jueves', date: '17 Oct', count: 5 },
    { name: 'Viernes', date: '18 Oct', count: 9 },
  ];

  const handleOpenAdd = () => {
    setEditingBlock(null);
    setFormData({
      location: 'Sede Principal - Consultorio 402',
      dayOfWeek: 'Lunes a Viernes',
      shiftType: 'Matutino',
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      intervalMinutes: 30,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (block: AvailabilityBlock) => {
    setEditingBlock(block);
    setFormData({
      location: block.location,
      dayOfWeek: block.dayOfWeek,
      shiftType: block.shiftType,
      startTime: block.startTime,
      endTime: block.endTime,
      intervalMinutes: block.intervalMinutes,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlock: AvailabilityBlock = {
      id: editingBlock ? editingBlock.id : Date.now(),
      location: formData.location,
      dayOfWeek: formData.dayOfWeek,
      shiftType: formData.shiftType,
      startTime: formData.startTime,
      endTime: formData.endTime,
      intervalMinutes: formData.intervalMinutes,
    };
    onAddBlock(newBlock);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
              Agenda Médica Profesional
            </span>
            <span className="text-xs text-[#757682]">• Gestión de Citas y Disponibilidad</span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
            {doctorName}
          </h1>
          <p className="text-sm text-[#444651] mt-1">
            Sede Principal - Consultorio 402 • Especialidad: Cardiología Clínica
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Generando reporte en PDF de la agenda semanal...')}
            className="px-4 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-sm font-semibold hover:bg-[#e3e1e9] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar Reporte
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Crear Nuevo Bloque
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002777] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Citas Hoy</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">8 Asignadas</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">100% Ocupación</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0056c3] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">schedule</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Bloques Activos</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">24 Horas</h3>
            <span className="text-[11px] text-[#444651] font-medium">2 Sedes configuradas</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#78C8ED] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">trending_up</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Tasa Asistencia</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">96.4%</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">+2.1% este mes</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e9e7ef] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Pacientes Nuevos</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">14 Citas</h3>
            <span className="text-[11px] text-[#444651] font-medium">Semana en curso</span>
          </div>
        </div>
      </div>

      {/* Week Strip Navigation */}
      <div className="bg-white rounded-2xl p-5 border border-[#e9e7ef] mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-[#001549]">Vista Semanal</h2>
          <span className="text-xs font-semibold text-[#0056c3]">Semana 42 • Octubre 2024</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weekDays.map((w) => {
            const isSelected = selectedDay === w.name;
            return (
              <button
                key={w.name}
                onClick={() => setSelectedDay(w.name)}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#002777] text-white border-[#002777] shadow-md scale-102'
                    : 'bg-[#f4f3fa] text-[#444651] border-transparent hover:bg-[#e9e7ef]'
                }`}
              >
                <p className="text-xs font-semibold uppercase">{w.name}</p>
                <p className="font-headline font-bold text-lg my-1">{w.date}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#e9e7ef] text-[#001549]'
                  }`}
                >
                  {w.count} Citas
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-column layout: Bloques Horarios & Citas de Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bloques Horarios Asignados (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg text-[#001549]">
              Bloques Horarios por Sede
            </h2>
            <span className="text-xs text-[#757682]">{blocks.length} activos</span>
          </div>

          <div className="space-y-4">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="bg-[#f4f3fa] rounded-2xl p-5 border border-[#e9e7ef] hover:shadow-sm transition-shadow flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#00164d] text-xs font-bold">
                      {block.shiftType}
                    </span>
                    <span className="text-xs text-[#757682] font-medium">{block.dayOfWeek}</span>
                  </div>
                  <h3 className="font-headline font-bold text-base text-[#001549]">{block.location}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#444651] mt-2">
                    <span className="material-symbols-outlined text-[18px] text-[#0056c3]">schedule</span>
                    <span>
                      {block.startTime} - {block.endTime}
                    </span>
                    <span className="text-xs text-[#757682]">• Intervalos: {block.intervalMinutes}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e9e7ef]">
                  <button
                    onClick={() => handleOpenEdit(block)}
                    className="p-1.5 text-xs text-[#0056c3] hover:bg-[#e9e7ef] rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteBlock(block.id)}
                    className="p-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Citas de Hoy (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg text-[#001549]">
              Citas de Hoy ({selectedDay} 15 Oct)
            </h2>
            <span className="text-xs font-medium text-[#757682]">
              {todayAppointments.length} Pacientes en lista
            </span>
          </div>

          <div className="space-y-3.5">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl p-5 border border-[#e9e7ef] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E4F4FB] text-[#0056c3] flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span className="text-[10px] text-[#757682]">HORA</span>
                    <span>{appt.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline font-bold text-base text-[#001549]">
                        {appt.patientName}
                      </h3>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          appt.status === 'Completada'
                            ? 'bg-[#e3e1e9] text-[#444651]'
                            : appt.status === 'No Asistió'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-[#dce1ff] text-[#00164d]'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#757682] mb-1">
                      {appt.patientId} • {appt.eps}
                    </p>
                    <p className="text-xs text-[#444651] line-clamp-1">{appt.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e9e7ef]">
                  {appt.status === 'Aprobada' ? (
                    <>
                      <button
                        onClick={() => onUpdateAppointmentStatus(appt.id, 'No Asistió')}
                        className="px-3 py-1.5 rounded-lg bg-[#ffdad6]/60 text-[#93000a] text-xs font-semibold hover:bg-[#ffdad6] transition-colors"
                      >
                        No asistió
                      </button>
                      <button
                        onClick={() => onUpdateAppointmentStatus(appt.id, 'Completada')}
                        className="px-3 py-1.5 rounded-lg bg-[#002777] text-white text-xs font-semibold hover:bg-[#006ef4] transition-colors shadow-sm"
                      >
                        Completada
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onUpdateAppointmentStatus(appt.id, 'Aprobada')}
                      className="px-3 py-1.5 rounded-lg bg-[#e9e7ef] text-[#001549] text-xs font-semibold hover:bg-[#e3e1e9] transition-colors"
                    >
                      Reabrir cita
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Crear o Editar Bloque Horario */}
      {showModal && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-6">
              <h3 className="font-headline font-bold text-xl text-[#001549]">
                {editingBlock ? 'Editar Bloque Horario' : 'Crear Nuevo Bloque Horario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">Sede Médica</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#f4f3fa] text-[#1a1b21] px-4 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                >
                  <option value="Sede Principal - Consultorio 402">Sede Principal - Consultorio 402</option>
                  <option value="Sede Norte - Sala de Procedimientos">Sede Norte - Sala de Procedimientos</option>
                  <option value="Sede Sur - Los Pinos">Sede Sur - Los Pinos</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1a1b21] mb-1">Días de Atención</label>
                  <input
                    type="text"
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full bg-[#f4f3fa] text-[#1a1b21] px-4 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                    placeholder="Ej. Lunes a Viernes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1b21] mb-1">Tipo de Turno</label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as any })}
                    className="w-full bg-[#f4f3fa] text-[#1a1b21] px-4 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Jornada Completa">Jornada Completa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a1b21] mb-1">Hora Inicio</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#f4f3fa] text-[#1a1b21] px-3 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                    placeholder="08:00 AM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1b21] mb-1">Hora Fin</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#f4f3fa] text-[#1a1b21] px-3 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                    placeholder="12:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a1b21] mb-1">Intervalo</label>
                  <select
                    value={formData.intervalMinutes}
                    onChange={(e) => setFormData({ ...formData, intervalMinutes: Number(e.target.value) })}
                    className="w-full bg-[#f4f3fa] text-[#1a1b21] px-3 py-2.5 rounded-xl text-sm outline-none border border-[#e9e7ef]"
                  >
                    <option value={20}>20 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e9e7ef] flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#e9e7ef] text-[#001549] text-sm font-semibold hover:bg-[#e3e1e9] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] transition-colors shadow-sm"
                >
                  Guardar Bloque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
