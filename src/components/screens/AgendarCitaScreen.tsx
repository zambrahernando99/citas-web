import React, { useState } from 'react';
import { DOCTOR_ROBERTO_PHOTO, DOCTORS } from '../../data/mockData';
import { Appointment, Screen, UserProfile } from '../../types';

interface AgendarCitaScreenProps {
  userProfile: UserProfile;
  onAppointmentBooked: (newAppointment: Appointment) => void;
  onNavigate: (screen: Screen) => void;
}

export const AgendarCitaScreen: React.FC<AgendarCitaScreenProps> = ({
  userProfile,
  onAppointmentBooked,
  onNavigate,
}) => {
  // Form State
  const [selectedLocation, setSelectedLocation] = useState('Sede Central HIC');
  const [appointmentType, setAppointmentType] = useState<'general' | 'especializada'>('general');
  const [specialty, setSpecialty] = useState('Cardiología');
  const [selectedDoctorId, setSelectedDoctorId] = useState('1');
  const [selectedDateDay, setSelectedDateDay] = useState(18); // Mié 18
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({
    time: '09:00 AM',
    duration: '60 min',
    doctor: 'Dr. Gomez',
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('HIC-849203');

  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];

  const dateStrip = [
    { dayName: 'Lun', dayNumber: 16, enabled: true },
    { dayName: 'Mar', dayNumber: 17, enabled: true },
    { dayName: 'Mié', dayNumber: 18, enabled: true },
    { dayName: 'Jue', dayNumber: 19, enabled: true },
    { dayName: 'Vie', dayNumber: 20, enabled: true },
    { dayName: 'Sáb', dayNumber: 21, enabled: false },
    { dayName: 'Dom', dayNumber: 22, enabled: false },
  ];

  const timeSlots = [
    { time: '08:00 AM', duration: '30 min', doctor: 'Dr. Gomez' },
    { time: '09:00 AM', duration: '60 min', doctor: 'Dr. Gomez' },
    { time: '10:30 AM', duration: '30 min', doctor: 'Dr. Gomez' },
    { time: '11:30 AM', duration: '30 min', doctor: 'Dra. Ruiz' },
    { time: '02:00 PM', duration: '60 min', doctor: 'Dr. Gomez' },
    { time: '03:30 PM', duration: '30 min', doctor: 'Dra. Ruiz' },
  ];

  const handleConfirm = () => {
    const code = `HIC-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedCode(code);

    const newAppt: Appointment = {
      id: `CIT-${Math.floor(8000 + Math.random() * 1000)}`,
      specialty: specialty,
      doctorName: selectedDoctor.name,
      location: selectedLocation,
      date: `${selectedDateDay} Oct 2024`,
      time: selectedTimeSlot.time,
      durationMinutes: selectedTimeSlot.duration.includes('60') ? 60 : 30,
      status: appointmentType === 'general' ? 'Aprobada' : 'Solicitada',
      patientName: userProfile.name,
      patientId: userProfile.documentId,
      eps: userProfile.eps,
      reason: appointmentType === 'general' ? 'Consulta médica general' : 'Consulta especializada remitida',
      isAutomaticApproval: appointmentType === 'general',
      code: code,
      consultingRoom: 'Consultorio 402'
    };

    onAppointmentBooked(newAppt);
    setShowConfirmationModal(true);
  };

  const resetFilters = () => {
    setSelectedLocation('Sede Central HIC');
    setAppointmentType('general');
    setSpecialty('Cardiología');
    setSelectedDoctorId('1');
    setSelectedDateDay(18);
    setSelectedTimeSlot({ time: '09:00 AM', duration: '60 min', doctor: 'Dr. Gomez' });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#e9e7ef] rounded-full text-xs font-semibold text-[#001549]">
            Portal Pacientes
          </span>
          <span className="text-xs text-[#757682]">/</span>
          <span className="text-xs font-medium text-[#444651]">Agendamiento de Citas</span>
        </div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#001549] tracking-tight">
          Agendar Nueva Cita Médica
        </h1>
        <p className="text-sm sm:text-base text-[#444651] max-w-2xl leading-relaxed">
          Seleccione los filtros de su preferencia, elija el profesional y la franja horaria disponible para su consulta médica de manera rápida y segura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Filters, Calendar & Slots (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Advanced Filters Section */}
          <div className="bg-[#f4f3fa] rounded-2xl p-6 shadow-sm border border-[#e9e7ef]/60 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002777] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-[#001549]">Filtros de Búsqueda</h2>
                  <p className="text-xs text-[#444651]">Personalice su búsqueda por sede, especialidad y profesional</p>
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-[#0056c3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                Restablecer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sede */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1b21]">Sede Médica</label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-white text-[#1a1b21] px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer text-sm shadow-sm border border-[#e9e7ef]"
                  >
                    <option value="Sede Central HIC">Sede Central HIC</option>
                    <option value="Sede Norte ICV">Sede Norte ICV</option>
                    <option value="Sede Sur - Los Pinos">Sede Sur - Los Pinos</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3.5 text-[#757682] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Tipo de cita */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1b21]">Tipo de Cita</label>
                <div className="relative">
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value as 'general' | 'especializada')}
                    className="w-full bg-white text-[#1a1b21] px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer text-sm shadow-sm border border-[#e9e7ef]"
                  >
                    <option value="general">Consulta General (Aprobación automática)</option>
                    <option value="especializada">Consulta Especializada (Requiere revisión)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3.5 text-[#757682] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Especialidad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1b21]">Especialidad</label>
                <div className="relative">
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-white text-[#1a1b21] px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer text-sm shadow-sm border border-[#e9e7ef]"
                  >
                    <option value="Cardiología">Cardiología</option>
                    <option value="Medicina General">Medicina General</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Ortopedia y Traumatología">Ortopedia y Traumatología</option>
                    <option value="Dermatología Clínica">Dermatología Clínica</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3.5 text-[#757682] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Profesional */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1a1b21]">Profesional (Opcional)</label>
                <div className="relative">
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-white text-[#1a1b21] px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer text-sm shadow-sm border border-[#e9e7ef]"
                  >
                    <option value="1">Dr. Roberto Gomez (Cardiología)</option>
                    <option value="4">Dra. Maria Fernanda Ruiz (Cardiología)</option>
                    <option value="2">Dra. Sofía Mendoza (Medicina General)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-3.5 text-[#757682] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selector Section */}
          <div className="bg-[#f4f3fa] rounded-2xl p-6 shadow-sm border border-[#e9e7ef]/60 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002777] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-[#001549]">Seleccione la Fecha</h2>
                  <p className="text-xs text-[#444651]">Octubre 2024 - {selectedLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert('Visualizando semana anterior')}
                  className="w-8 h-8 rounded-full bg-[#e9e7ef] flex items-center justify-center text-[#1a1b21] hover:bg-[#e3e1e9] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-[#001549] px-2">Octubre, 2024</span>
                <button 
                  onClick={() => alert('Visualizando semana siguiente')}
                  className="w-8 h-8 rounded-full bg-[#e9e7ef] flex items-center justify-center text-[#1a1b21] hover:bg-[#e3e1e9] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Horizontal Date Strip */}
            <div className="grid grid-cols-7 gap-2">
              {dateStrip.map((day) => {
                const isSelected = selectedDateDay === day.dayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    disabled={!day.enabled}
                    onClick={() => day.enabled && setSelectedDateDay(day.dayNumber)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                      !day.enabled
                        ? 'bg-white/50 text-[#757682]/40 cursor-not-allowed border border-dashed border-[#c5c6d3]/40'
                        : isSelected
                        ? 'bg-[#002777] text-white shadow-md scale-105 ring-2 ring-[#001549]'
                        : 'bg-white text-[#757682] hover:bg-[#e9e7ef] hover:text-[#001549] border border-[#e9e7ef] cursor-pointer'
                    }`}
                  >
                    <span className="text-xs uppercase font-medium">{day.dayName}</span>
                    <span className="font-headline font-bold text-base sm:text-lg mt-1">{day.dayNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="bg-[#f4f3fa] rounded-2xl p-6 shadow-sm border border-[#e9e7ef]/60 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002777] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-lg text-[#001549]">Franjas Horarias Disponibles</h2>
                  <p className="text-xs text-[#444651]">Miércoles {selectedDateDay} de Octubre, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#006ef4]"></span>
                  <span className="text-[#444651]">30 min (Estándar)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#78C8ED]"></span>
                  <span className="text-[#444651]">60 min (Prolongada)</span>
                </div>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot.time === slot.time;
                return (
                  <div
                    key={slot.time}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-sm border-2 ${
                      isSelected
                        ? 'bg-[#002777] text-white shadow-md ring-2 ring-[#001549] border-transparent'
                        : 'bg-white hover:bg-[#e9e7ef] text-[#1a1b21] border-[#e9e7ef]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-headline font-bold text-base ${isSelected ? 'text-white' : 'text-[#001549]'}`}>
                        {slot.time}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isSelected ? 'text-white' : 'text-[#0056c3]'
                        }`}
                      >
                        {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          slot.duration === '60 min'
                            ? isSelected
                              ? 'bg-[#78C8ED]/20 text-[#78C8ED]'
                              : 'bg-[#78C8ED]/20 text-[#0056c3]'
                            : isSelected
                            ? 'bg-[#006ef4]/20 text-white'
                            : 'bg-[#006ef4]/10 text-[#0056c3]'
                        }`}
                      >
                        {slot.duration}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-[#b5c4ff]' : 'text-[#757682]'}`}>
                        {slot.doctor}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Action (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#f4f3fa] rounded-2xl p-6 shadow-sm border border-[#e9e7ef]/60 sticky top-24 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#002777] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-lg text-[#001549]">Resumen de Cita</h2>
                <p className="text-xs text-[#444651]">Verifique los detalles antes de confirmar</p>
              </div>
            </div>

            {/* Selected Doctor Profile Card */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#e9e7ef]">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e9e7ef] ring-2 ring-[#002777]/20 shrink-0">
                <img
                  src={selectedDoctor.avatarUrl || DOCTOR_ROBERTO_PHOTO}
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-headline font-bold text-sm text-[#001549] truncate">
                  {selectedDoctor.name}
                </h4>
                <p className="text-xs text-[#757682] truncate">{selectedDoctor.specialty} Clínica</p>
              </div>
            </div>

            {/* Appointment Details List */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[#e9e7ef]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#757682]">Sede:</span>
                <span className="font-semibold text-[#1a1b21]">{selectedLocation}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#757682]">Tipo de Cita:</span>
                <span
                  className={`font-semibold ${
                    appointmentType === 'general' ? 'text-[#0056c3]' : 'text-[#e17959]'
                  }`}
                >
                  {appointmentType === 'general' ? 'Consulta General' : 'Consulta Especializada'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#757682]">Fecha:</span>
                <span className="font-semibold text-[#1a1b21]">
                  Mié, {selectedDateDay} Oct 2024
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#757682]">Hora y Duración:</span>
                <span className="font-bold text-[#00164d] bg-[#dce1ff] px-2.5 py-0.5 rounded-lg text-xs">
                  {selectedTimeSlot.time} ({selectedTimeSlot.duration})
                </span>
              </div>
            </div>

            {/* Notice Box */}
            <div className="p-4 bg-[#E4F4FB] rounded-xl flex items-start gap-3 border border-[#78C8ED]/30">
              <span className="material-symbols-outlined text-[#0056c3] text-[20px] mt-0.5">info</span>
              <p className="text-xs text-[#444651] leading-relaxed">
                {appointmentType === 'general' ? (
                  <>
                    Esta cita cuenta con{' '}
                    <strong className="text-[#001549] font-bold">aprobación automática</strong>. Una vez confirmada, quedará agendada inmediatamente en su calendario.
                  </>
                ) : (
                  <>
                    Esta cita especializada{' '}
                    <strong className="text-[#001549] font-bold">requiere revisión administrativa</strong> y de auditoría EPS. Le notificaremos cuando sea aprobada.
                  </>
                )}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleConfirm}
              className="w-full bg-[#002777] text-white py-3.5 px-6 rounded-xl font-headline font-semibold text-sm hover:bg-[#006ef4] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {appointmentType === 'general' ? 'check_circle' : 'send'}
              </span>
              {appointmentType === 'general' ? 'Confirmar Cita' : 'Enviar Solicitud'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-[#002777] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#002777]/25">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>

            <div className="text-center flex flex-col gap-2">
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#001549]">
                {appointmentType === 'general' ? '¡Cita Confirmada con Éxito!' : '¡Solicitud Enviada con Éxito!'}
              </h3>
              <p className="text-sm text-[#444651]">
                {appointmentType === 'general'
                  ? 'Su cita ha sido programada y registrada en el sistema. Hemos enviado los detalles a su correo electrónico.'
                  : 'Su solicitud ha sido radicada ante auditoría médica y validación EPS. Se le notificará a su correo.'}
              </p>
            </div>

            <div className="bg-[#f4f3fa] rounded-xl p-4 flex flex-col gap-2.5 text-sm border border-[#e9e7ef]">
              <div className="flex justify-between items-center">
                <span className="text-[#757682]">Código de Cita:</span>
                <span className="font-mono font-bold text-[#002777]">{generatedCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#757682]">Profesional:</span>
                <span className="font-semibold text-[#1a1b21]">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#757682]">Fecha y Hora:</span>
                <span className="font-medium text-[#1a1b21]">
                  {selectedDateDay} Oct 2024, {selectedTimeSlot.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#757682]">Sede:</span>
                <span className="font-medium text-[#1a1b21]">{selectedLocation}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onNavigate('mis-citas');
                }}
                className="flex-1 bg-[#e9e7ef] text-[#001549] py-3 rounded-xl font-headline font-semibold text-sm hover:bg-[#e3e1e9] transition-colors"
              >
                Ver Mis Citas
              </button>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  onNavigate('inicio');
                }}
                className="flex-1 bg-[#002777] text-white py-3 rounded-xl font-headline font-semibold text-sm hover:bg-[#006ef4] transition-colors shadow-sm"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
