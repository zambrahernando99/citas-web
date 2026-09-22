import React from 'react';
import { Screen, UserProfile } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  userProfile: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  userProfile,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: { screen: Screen; label: string; icon: string }[] = [
    { screen: 'inicio', label: 'Inicio', icon: 'home' },
    { screen: 'agendar-cita', label: 'Agendar Cita', icon: 'event_available' },
    { screen: 'mis-citas', label: 'Mis Citas', icon: 'calendar_month' },
    { screen: 'mi-disponibilidad', label: 'Mi Disponibilidad', icon: 'schedule' },
    { screen: 'mi-agenda', label: 'Mi Agenda', icon: 'view_agenda' },
    { screen: 'solicitudes', label: 'Solicitudes', icon: 'assignment' },
    { screen: 'reprogramaciones', label: 'Reprogramaciones', icon: 'update' },
    { screen: 'profesionales', label: 'Profesionales', icon: 'badge' },
    { screen: 'especialidades', label: 'Especialidades', icon: 'medical_services' },
    { screen: 'eps-y-planes', label: 'EPS y Planes', icon: 'verified' },
    { screen: 'mi-perfil', label: 'Mi Perfil', icon: 'person' },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#f4f3fa] pt-6 pb-8 shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      {/* Brand Header */}
      <div className="px-7 mb-7 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            onNavigate('inicio');
            onCloseMobile();
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#002777] flex items-center justify-center text-white font-bold shadow-md shadow-[#002777]/20">
            <span className="material-symbols-outlined text-[24px]">local_hospital</span>
          </div>
          <div>
            <span className="block font-headline font-bold text-[#001549] text-lg leading-tight">Portal Citas</span>
            <span className="text-xs text-[#444651] font-medium tracking-wide">Healthcare System</span>
          </div>
        </div>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-[#444651] hover:bg-[#e9e7ef]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => {
                onNavigate(item.screen);
                onCloseMobile();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm text-left group ${
                isActive
                  ? 'bg-[#002777] text-white font-bold shadow-sm'
                  : 'text-[#444651] hover:bg-[#e9e7ef] hover:text-[#001549]'
              }`}
            >
              <span
                className={`material-symbols-outlined mr-3 text-[22px] transition-transform ${
                  isActive ? 'text-white' : 'text-[#757682] group-hover:text-[#001549]'
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Brand identity book link */}
        <div className="pt-2">
          <button
            onClick={() => {
              onNavigate('manual-marca');
              onCloseMobile();
            }}
            className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-xs font-semibold ${
              currentScreen === 'manual-marca'
                ? 'bg-[#002777] text-white'
                : 'text-[#0056c3] bg-[#E4F4FB]/80 hover:bg-[#E4F4FB]'
            }`}
          >
            <span className="material-symbols-outlined mr-2.5 text-[18px]">palette</span>
            <span>Manual de Marca (Pantone 280 C)</span>
          </button>
        </div>
      </nav>

      {/* Bottom Profile Anchor Card */}
      <div className="px-6 pt-4 border-t border-[#c5c6d3]/30">
        <div 
          onClick={() => {
            onNavigate('mi-perfil');
            onCloseMobile();
          }}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#e9e7ef] cursor-pointer transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#001549] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shrink-0">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-[#001549]">{userProfile.name}</p>
            <p className="text-[11px] text-[#444651] truncate">Rol: {userProfile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 z-50 hidden lg:block">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-[#001549]/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={onCloseMobile}
        >
          <div 
            className="w-72 h-full bg-[#f4f3fa] shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
