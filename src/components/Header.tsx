import React, { useState } from 'react';
import { Role, Screen, UserProfile } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  userProfile: UserProfile;
  onNavigate: (screen: Screen) => void;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  activeRole,
  onRoleChange,
  userProfile,
  onNavigate,
  onOpenMobileMenu,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Cita Confirmada', desc: 'Dra. Sofía Mendoza - 14 Oct, 09:30 AM', time: 'Hace 10 min', unread: true },
    { id: 2, title: 'Nueva Solicitud Recibida', desc: 'María Camila Cárdenas solicitó reprogramación', time: 'Hace 25 min', unread: true },
    { id: 3, title: 'Auditoría EPS', desc: 'Validación completada para 4 pacientes', time: 'Hace 1 hora', unread: false }
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-12 border-b border-[#e9e7ef]/60">
      {/* Mobile brand & menu trigger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl hover:bg-[#e9e7ef] text-[#001549] transition-colors"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div className="flex items-center gap-2" onClick={() => onNavigate('inicio')}>
          <div className="w-8 h-8 rounded-lg bg-[#002777] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">local_hospital</span>
          </div>
          <span className="font-headline font-bold text-[#001549] text-base">Portal Citas</span>
        </div>
      </div>

      {/* Desktop breadcrumb indicator */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-[#444651]">
        <span className="font-medium text-[#001549]">Sistema Médico</span>
        <span>/</span>
        <span className="capitalize font-normal text-[#757682]">
          {currentScreen.replace('-', ' ')}
        </span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Selector Pill */}
        <div className="flex items-center gap-2 bg-[#f4f3fa] px-3 py-1.5 rounded-full border border-[#e9e7ef]">
          <span className="text-xs sm:text-sm text-[#444651] font-medium hidden sm:inline">Rol Activo:</span>
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-[#001549] outline-none cursor-pointer pr-1"
          >
            <option value="USER">USER (Paciente)</option>
            <option value="PROFESSIONAL">PROFESSIONAL (Médico)</option>
            <option value="ADMIN">ADMIN (Auditoría)</option>
          </select>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-full hover:bg-[#e9e7ef] flex items-center justify-center text-[#444651] transition-colors relative"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0B7CF5] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e9e7ef] p-4 z-50 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#e9e7ef]">
                <h4 className="font-headline font-semibold text-[#001549] text-sm">Notificaciones del Sistema</h4>
                <span className="text-xs bg-[#dce1ff] text-[#00164d] px-2 py-0.5 rounded-full font-medium">3 Nuevas</span>
              </div>
              <div className="divide-y divide-[#f4f3fa] max-h-72 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-2 hover:bg-[#f4f3fa] rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#001549]">
                      <span>{n.title}</span>
                      <span className="text-[#757682] font-normal">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#444651] mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center border-t border-[#e9e7ef] mt-2">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#0056c3] font-medium hover:underline"
                >
                  Marcar todas como leídas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full bg-[#001549] hover:bg-[#002777] flex items-center justify-center text-white transition-all ring-2 ring-white shadow-sm"
            title={userProfile.name}
          >
            <span className="material-symbols-outlined text-white text-[19px]">person</span>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e9e7ef] p-3 z-50 animate-in fade-in zoom-in duration-150">
              <div className="px-3 py-2 border-b border-[#e9e7ef] mb-2">
                <p className="font-semibold text-sm text-[#001549] truncate">{userProfile.name}</p>
                <p className="text-xs text-[#757682] truncate">{userProfile.title}</p>
                <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#00164d]">
                  {activeRole}
                </span>
              </div>
              <button
                onClick={() => {
                  onNavigate('mi-perfil');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#444651] hover:bg-[#f4f3fa] hover:text-[#001549] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                Ver Mi Perfil
              </button>
              <button
                onClick={() => {
                  onNavigate('manual-marca');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#444651] hover:bg-[#f4f3fa] hover:text-[#001549] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">palette</span>
                Manual de Marca & Guía de Estilo
              </button>
              <div className="border-t border-[#e9e7ef] my-1"></div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
