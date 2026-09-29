import { Role, Screen, UserProfile } from '../types';

interface SidebarProps { currentScreen:Screen; onNavigate:(screen:Screen)=>void; userProfile:UserProfile; isOpenMobile:boolean; onCloseMobile:()=>void; roles:Role[]; }
const allItems:Array<{screen:Screen;label:string;roles:Role[]}>=[
  {screen:'inicio',label:'Inicio',roles:['USER','PROFESSIONAL','ADMIN']},
  {screen:'agendar-cita',label:'Agendar cita',roles:['USER']},
  {screen:'mis-citas',label:'Mis citas',roles:['USER']},
  {screen:'mi-disponibilidad',label:'Mi disponibilidad',roles:['PROFESSIONAL']},
  {screen:'mi-agenda',label:'Mi agenda',roles:['PROFESSIONAL']},
  {screen:'solicitudes',label:'Solicitudes',roles:['ADMIN']},
  {screen:'reprogramaciones',label:'Reprogramaciones',roles:['ADMIN']},
  {screen:'profesionales',label:'Profesionales',roles:['ADMIN','USER']},
  {screen:'especialidades',label:'Especialidades',roles:['ADMIN','USER']},
  {screen:'eps-y-planes',label:'EPS y planes',roles:['ADMIN','USER']},
  {screen:'mi-perfil',label:'Mi perfil',roles:['USER','PROFESSIONAL','ADMIN']},
];
export const Sidebar=({currentScreen,onNavigate,userProfile,isOpenMobile,onCloseMobile,roles}:SidebarProps)=>{
  const content=<div className="flex h-full flex-col bg-[#f4f3fa] px-4 pb-6 pt-6"><div className="mb-7 flex items-center gap-3 px-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002777] text-white"><span className="material-symbols-outlined">local_hospital</span></span><div><p className="font-bold text-[#001549]">Portal Citas</p><p className="text-xs text-[#444651]">Agenda y atención</p></div></div><nav className="flex-1 space-y-1">{allItems.filter(item=>item.roles.some(role=>roles.includes(role))).map(item=><button key={item.screen} onClick={()=>{onNavigate(item.screen);onCloseMobile();}} className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium ${currentScreen===item.screen?'bg-[#002777] font-bold text-white':'text-[#444651] hover:bg-[#e9e7ef]'}`}><span className="mr-3 material-symbols-outlined text-xl">{item.screen==='inicio'?'home':item.screen==='mi-perfil'?'person':item.screen.includes('cita')?'event':item.screen.includes('agenda')||item.screen.includes('disponibilidad')?'schedule':item.screen.includes('solicitud')||item.screen.includes('reprogram')?'assignment':item.screen==='profesionales'?'badge':item.screen==='especialidades'?'medical_services':'verified'}</span>{item.label}</button>)}</nav><div className="border-t border-[#c5c6d3]/40 pt-4"><p className="truncate px-3 text-xs font-bold text-[#001549]">{userProfile.name}</p><p className="px-3 text-[11px] text-[#444651]">{roles.join(' · ')}</p></div></div>;
  return <><aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 lg:block">{content}</aside>{isOpenMobile&&<div className="fixed inset-0 z-50 bg-[#001549]/40 lg:hidden" onClick={onCloseMobile}><aside className="h-full w-72 shadow-2xl" onClick={e=>e.stopPropagation()}>{content}</aside></div>}</>;
};
