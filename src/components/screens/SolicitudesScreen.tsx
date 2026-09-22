import React, { useState } from 'react';
import { RequestItem } from '../../types';

interface SolicitudesScreenProps {
  requests: RequestItem[];
  onRequestStatusUpdate: (id: string, status: 'aprobada' | 'rechazada', rejectReason?: string) => void;
}

export const SolicitudesScreen: React.FC<SolicitudesScreenProps> = ({
  requests,
  onRequestStatusUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'pendiente' | 'aprobada' | 'rechazada'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientId.includes(searchTerm) ||
      r.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === 'ALL' ||
      (selectedType === 'REPROGRAMACION' && r.type === 'REPROGRAMACIÓN') ||
      (selectedType === 'ESPECIALIZADA' && r.type === 'SOLICITUD ESPECIALIZADA');
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === 'pendiente').length;
  const reprogCount = requests.filter((r) => r.type === 'REPROGRAMACIÓN').length;
  const approvedCount = requests.filter((r) => r.status === 'aprobada').length;

  const handleApprove = (req: RequestItem) => {
    onRequestStatusUpdate(req.id, 'aprobada');
    if (selectedRequest?.id === req.id) {
      setSelectedRequest(null);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !rejectReason.trim()) return;
    onRequestStatusUpdate(selectedRequest.id, 'rechazada', rejectReason.trim());
    setRejectModalOpen(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#dce1ff] text-[#00164d] rounded-full text-xs font-bold uppercase tracking-wider">
            Auditoría Médica
          </span>
          <span className="text-xs text-[#757682]">• Gestión de Solicitudes y Reprogramaciones</span>
        </div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#001549]">
          Solicitudes y Aprobaciones Clínicas
        </h1>
        <p className="text-sm text-[#444651]">
          Audite, apruebe o gestione las citas de pacientes remitidos y cambios de fechas con verificación de cobertura EPS.
        </p>
      </div>

      {/* 4 Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#002777] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">pending_actions</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Pendientes</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">{pendingCount}</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">+3 prioritarias hoy</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0056c3] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">update</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Reprogramaciones</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">{reprogCount}</h3>
            <span className="text-[11px] text-[#444651] font-medium">Revisión de agenda</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#78C8ED] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Aprobadas Hoy</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">{approvedCount + 42}</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">Meta diaria: 96%</span>
          </div>
        </div>

        <div className="bg-[#f4f3fa] p-5 rounded-2xl border border-[#e9e7ef]/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e9e7ef] text-[#001549] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">timer</span>
          </div>
          <div>
            <span className="text-xs text-[#757682] font-semibold uppercase">Tiempo Promedio</span>
            <h3 className="font-headline font-bold text-2xl text-[#001549]">14 min</h3>
            <span className="text-[11px] text-[#0056c3] font-medium">-2.4 min vs ayer</span>
          </div>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e9e7ef] mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#757682] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, documento o especialidad..."
            className="w-full bg-[#f4f3fa] pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-[#002777]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#f4f3fa] text-xs font-semibold text-[#1a1b21] px-3 py-2.5 rounded-xl outline-none border border-[#e9e7ef] cursor-pointer"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="REPROGRAMACION">Solo Reprogramaciones</option>
            <option value="ESPECIALIZADA">Solo Solicitud Especializada</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-[#f4f3fa] text-xs font-semibold text-[#1a1b21] px-3 py-2.5 rounded-xl outline-none border border-[#e9e7ef] cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>

          {/* Toggle View */}
          <div className="flex items-center bg-[#f4f3fa] p-1 rounded-xl border border-[#e9e7ef]">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'cards' ? 'bg-[#002777] text-white shadow-sm' : 'text-[#444651]'
              }`}
              title="Vista de Tarjetas"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-[#002777] text-white shadow-sm' : 'text-[#444651]'
              }`}
              title="Vista de Tabla"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-6 border border-[#e9e7ef] shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
            >
              <div>
                {/* Badge & Time */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      req.type === 'REPROGRAMACIÓN'
                        ? 'bg-[#E4F4FB] text-[#0056c3]'
                        : 'bg-[#ffdbd1] text-[#7c2d13]'
                    }`}
                  >
                    {req.type}
                  </span>
                  <span className="text-xs text-[#757682]">{req.timeAgo}</span>
                </div>

                {/* Patient Information */}
                <h3 className="font-headline font-bold text-lg text-[#001549]">{req.patientName}</h3>
                <p className="text-xs text-[#757682] mb-3">
                  CC {req.patientId} • {req.eps}
                </p>

                {/* Dates & Location */}
                <div className="bg-[#f4f3fa] p-3 rounded-xl mb-4 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Especialidad:</span>
                    <span className="font-semibold text-[#001549]">{req.specialty}</span>
                  </div>
                  {req.previousDate && (
                    <div className="flex justify-between text-[#ba1a1a]">
                      <span>Fecha previa:</span>
                      <span className="line-through">{req.previousDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#002777]">
                    <span className="font-semibold">Nueva fecha:</span>
                    <span className="font-bold">{req.newDate}, {req.newTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#757682]">Sede:</span>
                    <span>{req.location}</span>
                  </div>
                </div>

                {/* Clinical Reason */}
                <p className="text-xs text-[#444651] italic bg-[#faf8ff] p-2.5 rounded-lg border border-[#e9e7ef]">
                  "{req.reason}"
                </p>

                {/* Rejection notice if any */}
                {req.status === 'rechazada' && req.rejectReason && (
                  <div className="mt-3 p-2 bg-[#ffdad6] text-[#93000a] text-xs rounded-lg">
                    <strong>Motivo de rechazo:</strong> {req.rejectReason}
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-4 border-t border-[#e9e7ef] mt-4">
                {req.status === 'pendiente' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setRejectModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#ffdad6]/60 text-[#93000a] text-xs font-semibold hover:bg-[#ffdad6] transition-colors"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleApprove(req)}
                      className="flex-1 py-2 rounded-xl bg-[#002777] text-white text-xs font-semibold hover:bg-[#006ef4] transition-colors shadow-sm"
                    >
                      Aprobar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        req.status === 'aprobada'
                          ? 'bg-[#dce1ff] text-[#00164d]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {req.status === 'aprobada' ? '✓ Aprobada y Agendada' : '✗ Solicitud Rechazada'}
                    </span>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="text-xs text-[#0056c3] hover:underline"
                    >
                      Ver Detalle
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e9e7ef] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f4f3fa] text-[#444651] text-xs uppercase font-semibold border-b border-[#e9e7ef]">
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Paciente</th>
                  <th className="py-4 px-6">Especialidad</th>
                  <th className="py-4 px-6">Nueva Fecha</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9e7ef] text-sm">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#f4f3fa]/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-[#002777] bg-[#dce1ff] px-2 py-0.5 rounded-full">
                        {req.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#1a1b21]">
                      {req.patientName}
                      <span className="block text-xs text-[#757682]">{req.patientId}</span>
                    </td>
                    <td className="py-4 px-6 text-[#444651]">{req.specialty}</td>
                    <td className="py-4 px-6 font-semibold text-[#001549]">
                      {req.newDate}, {req.newTime}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          req.status === 'pendiente'
                            ? 'bg-[#ffdbd1] text-[#7c2d13]'
                            : req.status === 'aprobada'
                            ? 'bg-[#dce1ff] text-[#00164d]'
                            : 'bg-[#ffdad6] text-[#93000a]'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {req.status === 'pendiente' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setRejectModalOpen(true);
                            }}
                            className="text-xs text-[#93000a] hover:underline"
                          >
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleApprove(req)}
                            className="text-xs text-[#002777] font-bold hover:underline"
                          >
                            Aprobar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-xs text-[#0056c3] hover:underline"
                        >
                          Ver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e9e7ef] mb-4 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[28px]">gpp_maybe</span>
              <h3 className="font-headline font-bold text-lg text-[#1a1b21]">
                Motivo Obligatorio de Rechazo
              </h3>
            </div>
            <p className="text-xs text-[#444651] mb-4 leading-relaxed">
              Conforme al protocolo de auditoría médica, debe detallar la justificación clínica o administrativa para rechazar la solicitud de <strong>{selectedRequest.patientName}</strong>.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1b21] mb-1">
                  Justificación Clínica / EPS
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ej. Inconsistencia en la orden de remisión EPS, falta de exámenes diagnósticos requeridos, o no hay disponibilidad en la sede indicada."
                  required
                  className="w-full bg-[#f4f3fa] p-3 rounded-xl text-sm outline-none border border-[#e9e7ef] focus:border-[#ba1a1a]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#e9e7ef] flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e9e7ef] text-[#001549] text-xs font-semibold hover:bg-[#e3e1e9]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-[#93000a] shadow-sm"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Comparative Modal */}
      {selectedRequest && !rejectModalOpen && (
        <div className="fixed inset-0 bg-[#001549]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e9e7ef] animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e7ef] mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#002777]">{selectedRequest.type}</span>
                <h3 className="font-headline font-bold text-xl text-[#001549]">
                  {selectedRequest.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f4f3fa] flex items-center justify-center text-[#757682]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Documento:</span>
                <span className="font-semibold text-[#1a1b21]">{selectedRequest.patientId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Aseguradora EPS:</span>
                <span className="font-semibold text-[#1a1b21]">{selectedRequest.eps}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Especialidad:</span>
                <span className="font-semibold text-[#001549]">{selectedRequest.specialty}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Sede Asignada:</span>
                <span className="font-medium text-[#1a1b21]">{selectedRequest.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4f3fa]">
                <span className="text-[#757682]">Nueva Fecha Propuesta:</span>
                <span className="font-bold text-[#002777]">{selectedRequest.newDate} a las {selectedRequest.newTime}</span>
              </div>
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#757682] block mb-1">Motivo / Notas clínicas:</span>
                <p className="text-xs text-[#444651] bg-[#f4f3fa] p-3 rounded-xl">{selectedRequest.reason}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e9e7ef] flex gap-3">
              {selectedRequest.status === 'pendiente' ? (
                <>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm font-semibold hover:bg-[#ffdad6]/80"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="flex-1 py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4] shadow-sm"
                  >
                    Aprobar Solicitud
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full py-2.5 rounded-xl bg-[#002777] text-white text-sm font-semibold hover:bg-[#006ef4]"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
