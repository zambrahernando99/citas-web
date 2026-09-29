import { FormEvent, useEffect, useState } from 'react';
import { AuthTokens, CurrentUser, updateCurrentUser } from '../../services/authApi';
import { AppointmentResult, AvailableSlot, InboxItem, InboxType, StatusChange, adminInbox, appointmentHistory, cancelAppointment, closeProfessionalAppointment, createProfessionalBlock, decideAppointment, decideReschedule, deleteProfessionalBlock, findAvailability, myAppointments, professionalAppointments, professionalBlocks, requestReschedule, reserveAppointment, updateProfessionalBlock } from '../../services/appointmentApi';
import { ClinicLocation, Professional, Specialty, getLocations, getProfessionals, getSpecialties } from '../../services/professionalOfferApi';
import { Screen } from '../../types';
import { appointmentStatusLabels as statusLabels } from '../../navigation';

const card = 'bg-white rounded-2xl border border-[#e9e7ef] p-5 shadow-sm';
const button = 'rounded-xl bg-[#002777] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50';
const dateOf = (value: string) => value.slice(0, 10);
const timeOf = (value: string) => value.slice(11, 16);
const reportError = (error: unknown) => error instanceof Error ? error.message : 'No fue posible completar la solicitud.';

export function LiveDashboard({ tokens, user, onNavigate }: { tokens: AuthTokens; user: CurrentUser; onNavigate: (screen: Screen) => void }) {
  const [appointments, setAppointments] = useState<AppointmentResult[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { void myAppointments(tokens).then(setAppointments).catch((reason) => setError(reportError(reason))); }, [tokens.accessToken]);
  return <section className="mx-auto w-full max-w-7xl space-y-6">
    <div className={card}><p className="text-xs font-bold uppercase tracking-wide text-[#0056c3]">Portal de citas</p><h1 className="mt-2 text-3xl font-bold text-[#001549]">Hola, {user.givenNames}</h1><p className="mt-2 text-sm text-[#444651]">Consulta y gestiona tu agenda desde información actualizada del servicio.</p><button className={`${button} mt-5`} onClick={() => onNavigate('agendar-cita')}>Buscar disponibilidad</button></div>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#001549]">Próximas citas</h2><button className="text-sm font-semibold text-[#0056c3]" onClick={() => onNavigate('mis-citas')}>Ver todas</button></div>
    {error && <div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}
    {appointments.filter((item) => ['APPROVED', 'REQUESTED'].includes(item.status)).slice(0, 5).map((item) => <AppointmentCard key={item.id} appointment={item} />)}
    {!error && appointments.length === 0 && <p className={`${card} text-sm text-[#757682]`}>Todavía no tienes citas registradas.</p>}
  </section>;
}

export function ProfileScreen({tokens,user,onUpdated}:{tokens:AuthTokens;user:CurrentUser;onUpdated:(user:CurrentUser)=>void}) {
  const [form,setForm]=useState({givenNames:user.givenNames,familyNames:user.familyNames,email:user.email,phone:user.phone}); const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [saving,setSaving]=useState(false);
  const submit=async(event:FormEvent)=>{event.preventDefault();setError('');setMessage('');setSaving(true);try{onUpdated(await updateCurrentUser(tokens,form));setMessage('Perfil actualizado.');}catch(e){setError(reportError(e));}finally{setSaving(false);}};
  return <section className="mx-auto max-w-3xl space-y-5"><div><p className="text-xs font-bold uppercase text-[#0056c3]">Cuenta</p><h1 className="mt-1 text-3xl font-bold text-[#001549]">Mi perfil</h1></div>{error&&<div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}{message&&<div role="status" className="rounded-xl bg-[#dcefe4] p-4 text-sm text-[#006c49]">{message}</div>}<form className={`${card} grid gap-4 sm:grid-cols-2`} onSubmit={submit}>{([['givenNames','Nombres'],['familyNames','Apellidos'],['email','Correo electrónico'],['phone','Teléfono']] as const).map(([key,label])=><label key={key} className="text-sm font-semibold">{label}<input className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" type={key==='email'?'email':'text'} required value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<div className="text-sm text-[#444651]">Rol: {user.roles.join(', ')}</div><button className={button} disabled={saving}>{saving?'Guardando…':'Guardar cambios'}</button></form></section>;
}

function AppointmentCard({ appointment }: { appointment: AppointmentResult }) {
  return <article className={card}><div className="flex flex-wrap justify-between gap-2"><div><h3 className="font-bold text-[#001549]">{appointment.specialty}</h3><p className="text-sm text-[#444651]">{appointment.professionalName} · {appointment.location}</p></div><span className="h-fit rounded-full bg-[#dce1ff] px-3 py-1 text-xs font-semibold text-[#00164d]">{statusLabels[appointment.status] ?? appointment.status}</span></div><p className="mt-3 text-sm">{dateOf(appointment.startsAt)} · {timeOf(appointment.startsAt)} · {appointment.durationMinutes} min</p>{appointment.decisionReason && <p className="mt-2 text-sm text-[#93000a]">Motivo: {appointment.decisionReason}</p>}</article>;
}

export function BookingScreen({ tokens, onBooked }: { tokens: AuthTokens; onBooked: () => void }) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]); const [locations, setLocations] = useState<ClinicLocation[]>([]); const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialtyId, setSpecialtyId] = useState(''); const [locationId, setLocationId] = useState(''); const [professionalId, setProfessionalId] = useState(''); const [date, setDate] = useState('');
  const [slots, setSlots] = useState<AvailableSlot[]>([]); const [selected, setSelected] = useState(''); const [reason, setReason] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  useEffect(() => { void Promise.all([getSpecialties(tokens), getLocations(tokens), getProfessionals(tokens, false)]).then(([s, l, p]) => { setSpecialties(s); setLocations(l); setProfessionals(p); }).catch((e) => setError(reportError(e))); }, [tokens.accessToken]);
  const search = async (event: FormEvent) => { event.preventDefault(); setLoading(true); setError(''); setSlots([]); setSelected(''); try { setSlots(await findAvailability(tokens, { locationId: Number(locationId), specialtyId: Number(specialtyId), professionalId, date })); } catch (e) { setError(reportError(e)); } finally { setLoading(false); } };
  const book = async () => { setLoading(true); setError(''); try { const result = await reserveAppointment(tokens, { locationId: Number(locationId), specialtyId: Number(specialtyId), professionalId, startsAt: selected, reason: reason || undefined }); setMessage(result.status === 'APPROVED' ? 'Cita confirmada.' : 'Solicitud enviada para aprobación.'); setSlots([]); setSelected(''); onBooked(); } catch (e) { setError(reportError(e)); } finally { setLoading(false); } };
  const eligibleProfessionals = professionals.filter((p) => p.locations.some((l) => l.id === Number(locationId)) && p.specialties.some((s) => s.specialty.id === Number(specialtyId)));
  return <section className="mx-auto w-full max-w-5xl space-y-6"><div><p className="text-xs font-bold uppercase text-[#0056c3]">Reservas</p><h1 className="mt-1 text-3xl font-bold text-[#001549]">Buscar disponibilidad</h1></div>
    {error && <div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}{message && <div role="status" className="rounded-xl bg-[#dcefe4] p-4 text-sm text-[#006c49]">{message}</div>}
    <form className={`${card} grid gap-4 sm:grid-cols-2`} onSubmit={search}>
      <label className="text-sm font-semibold">Sede<select className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" required value={locationId} onChange={(e) => { setLocationId(e.target.value); setProfessionalId(''); }}><option value="">Selecciona</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Especialidad<select className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" required value={specialtyId} onChange={(e) => { setSpecialtyId(e.target.value); setProfessionalId(''); }}><option value="">Selecciona</option>{specialties.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.durationMinutes} min</option>)}</select></label>
      <label className="text-sm font-semibold">Profesional<select className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" required value={professionalId} onChange={(e) => setProfessionalId(e.target.value)}><option value="">Selecciona</option>{eligibleProfessionals.map((p) => <option key={p.id} value={p.id}>{p.givenNames} {p.familyNames}</option>)}</select></label>
      <label className="text-sm font-semibold">Fecha<input className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="text-sm font-semibold sm:col-span-2">Motivo (opcional)<textarea className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} /></label>
      <button className={button} disabled={loading}>{loading ? 'Consultando…' : 'Consultar horarios'}</button>
    </form>
    {slots.length > 0 && <div className={card}><h2 className="font-bold text-[#001549]">Horarios disponibles</h2><div className="mt-4 flex flex-wrap gap-2">{slots.map((slot) => <button key={slot.startsAt} type="button" onClick={() => setSelected(slot.startsAt)} className={`rounded-lg border px-4 py-2 text-sm ${selected === slot.startsAt ? 'border-[#002777] bg-[#002777] text-white' : 'border-[#e9e7ef]'}`}>{timeOf(slot.startsAt)}</button>)}</div><button className={`${button} mt-5`} disabled={!selected || loading} onClick={() => void book()}>{loading ? 'Guardando…' : 'Confirmar cita'}</button></div>}
    {slots.length === 0 && date && !loading && !error && <p className={`${card} text-sm text-[#757682]`}>No hay horarios para esos filtros y fecha.</p>}
  </section>;
}

const sourceLabels: Record<string, string> = { USER: 'Paciente', ADMIN: 'Administración', SYSTEM: 'Sistema' };

function HistoryPanel({ tokens, appointmentId, onClose }: { tokens: AuthTokens; appointmentId: string; onClose: () => void }) {
  const [entries, setEntries] = useState<StatusChange[] | null>(null); const [error, setError] = useState('');
  useEffect(() => { let active = true; setEntries(null); setError(''); void appointmentHistory(tokens, appointmentId).then((data) => { if (active) setEntries(data); }).catch((e) => { if (active) setError(reportError(e)); }); return () => { active = false; }; }, [tokens.accessToken, appointmentId]);
  return <div role="region" aria-label="Historial de la cita" className="mt-4 rounded-xl bg-[#f4f3fa] p-4"><div className="flex items-center justify-between"><h4 className="text-sm font-bold text-[#001549]">Historial</h4><button className="text-xs font-semibold text-[#0056c3]" onClick={onClose}>Cerrar historial</button></div>
    {error && <div role="alert" className="mt-2 rounded-xl bg-[#ffdad6] p-3 text-sm text-[#93000a]">{error}</div>}
    {!error && entries === null && <p className="mt-2 text-sm text-[#757682]">Cargando historial...</p>}
    {!error && entries?.length === 0 && <p className="mt-2 text-sm text-[#757682]">Sin cambios de estado registrados.</p>}
    {entries && entries.length > 0 && <ol className="mt-2 space-y-2">{entries.map((entry, index) => <li key={`${entry.changedAt}-${index}`} className="text-sm text-[#444651]"><span className="font-semibold text-[#001549]">{statusLabels[entry.status] ?? entry.status}</span> · {sourceLabels[entry.source] ?? entry.source} · {dateOf(entry.changedAt)} {timeOf(entry.changedAt)}{entry.reason && <span> · {entry.reason}</span>}</li>)}</ol>}
  </div>;
}

export function MyAppointmentsScreen({ tokens, onNavigate }: { tokens: AuthTokens; onNavigate: (screen: Screen) => void }) {
  const [items, setItems] = useState<AppointmentResult[]>([]); const [status, setStatus] = useState(''); const [from, setFrom] = useState(''); const [to, setTo] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [rescheduleTarget,setRescheduleTarget]=useState<AppointmentResult|null>(null); const [newDate,setNewDate]=useState(''); const [newSlots,setNewSlots]=useState<AvailableSlot[]|null>(null); const [newSlot,setNewSlot]=useState(''); const [reason,setReason]=useState(''); const [modalError,setModalError]=useState(''); const [historyId,setHistoryId]=useState('');
  const load = () => { setError(''); void myAppointments(tokens, { status, from, to }).then(setItems).catch((e) => setError(reportError(e))); };
  useEffect(load, [tokens.accessToken, status, from, to]);
  const cancel = async (item: AppointmentResult) => { if (!window.confirm('¿Cancelar esta cita?')) return; setBusy(true); setError(''); try { await cancelAppointment(tokens, item.id); load(); } catch (e) { setError(reportError(e)); } finally { setBusy(false); } };
  const openReschedule = (item: AppointmentResult) => { setRescheduleTarget(item); setNewDate(''); setNewSlots(null); setNewSlot(''); setReason(''); setModalError(''); };
  const searchNewSlots = async () => { if (!rescheduleTarget || !newDate) return; setModalError(''); setBusy(true); try { setNewSlots(await findAvailability(tokens,{professionalId:rescheduleTarget.professionalId,specialtyId:rescheduleTarget.specialtyId,locationId:rescheduleTarget.locationId,date:newDate})); setNewSlot(''); }catch(e){setModalError(reportError(e));}finally{setBusy(false);} };
  const submitReschedule = async () => { if(!rescheduleTarget||!newSlot)return; setBusy(true); setModalError(''); try { await requestReschedule(tokens,rescheduleTarget.id,newSlot,reason.trim()||undefined); setRescheduleTarget(null); setNewSlots(null); setNewDate(''); setReason(''); load(); }catch(e){setModalError(reportError(e));}finally{setBusy(false);} };
  return <section className="mx-auto w-full max-w-7xl space-y-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-[#0056c3]">Portal paciente</p><h1 className="mt-1 text-3xl font-bold text-[#001549]">Mis citas</h1></div><button className={button} onClick={() => onNavigate('agendar-cita')}>Agendar cita</button></div>
    <div className={`${card} flex flex-wrap gap-3`}><label className="text-xs font-semibold">Estado<select className="ml-2 rounded-lg bg-[#f4f3fa] p-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos</option>{['REQUESTED','APPROVED','REJECTED','CANCELLED','COMPLETED','NO_SHOW'].map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label><label className="text-xs font-semibold">Desde<input className="ml-2 rounded-lg bg-[#f4f3fa] p-2" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label><label className="text-xs font-semibold">Hasta<input className="ml-2 rounded-lg bg-[#f4f3fa] p-2" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label></div>
    {error && <div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}{items.map((item) => { const active = ['REQUESTED','APPROVED'].includes(item.status) && new Date(item.startsAt) > new Date(); const pending = !!item.reschedulePending; return <div key={item.id} className={card}><div className="flex flex-wrap items-start justify-between gap-3"><AppointmentCard appointment={item} /><div className="flex flex-wrap items-center gap-2">{pending&&<span className="rounded-xl bg-[#fff0c2] px-3 py-2 text-xs font-semibold text-[#684900]">Reprogramación pendiente</span>}<button className="rounded-xl bg-[#f4f3fa] px-3 py-2 text-xs font-semibold text-[#001549]" onClick={() => setHistoryId(historyId === item.id ? '' : item.id)}>Historial</button>{active && item.status==='APPROVED'&&<button className="rounded-xl bg-[#e9e7ef] px-3 py-2 text-xs font-semibold disabled:opacity-50" disabled={busy || pending} onClick={() => openReschedule(item)}>Solicitar reprogramación</button>}{active&&<button className="rounded-xl bg-[#ffdad6] px-3 py-2 text-xs font-semibold text-[#93000a] disabled:opacity-50" disabled={busy || pending} onClick={() => void cancel(item)}>Cancelar</button>}</div></div>{historyId === item.id && <HistoryPanel tokens={tokens} appointmentId={item.id} onClose={() => setHistoryId('')} />}</div>; })}
    {!error && items.length === 0 && <p className={`${card} text-sm text-[#757682]`}>No se encontraron citas para los filtros seleccionados.</p>}
    {rescheduleTarget&&<div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#001549]/50 p-4"><div role="dialog" aria-modal="true" aria-label="Solicitar reprogramación" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6"><div><h2 className="text-xl font-bold text-[#001549]">Solicitar reprogramación</h2><p className="mt-1 text-sm text-[#444651]">{rescheduleTarget.specialty} · {rescheduleTarget.professionalName} · {rescheduleTarget.location}. La cita actual se conserva mientras ADMIN revisa la nueva franja.</p></div>{modalError && <div role="alert" className="rounded-xl bg-[#ffdad6] p-3 text-sm text-[#93000a]">{modalError}</div>}<label className="block text-sm font-semibold">Nueva fecha<input className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" type="date" min={new Date().toISOString().slice(0,10)} value={newDate} onChange={e=>setNewDate(e.target.value)} /></label><button className={button} disabled={!newDate||busy} onClick={()=>void searchNewSlots()}>Buscar horarios</button>{newSlots&&newSlots.length>0&&<div className="flex flex-wrap gap-2">{newSlots.map(slot=><button key={slot.startsAt} aria-pressed={newSlot===slot.startsAt} className={`rounded-lg border px-3 py-2 text-sm ${newSlot===slot.startsAt?'bg-[#002777] text-white':'border-[#e9e7ef]'}`} onClick={()=>setNewSlot(slot.startsAt)}>{timeOf(slot.startsAt)}</button>)}</div>}{newSlots&&newSlots.length===0&&<p className="text-sm text-[#757682]">No hay horarios disponibles para esa fecha.</p>}<label className="block text-sm font-semibold">Motivo (opcional)<textarea className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" maxLength={500} value={reason} onChange={e=>setReason(e.target.value)} /></label><div className="flex justify-end gap-2"><button className="rounded-xl bg-[#e9e7ef] px-4 py-2 text-sm" disabled={busy} onClick={()=>setRescheduleTarget(null)}>Cerrar</button><button className={button} disabled={!newSlot||busy} onClick={()=>void submitReschedule()}>Enviar solicitud</button></div></div></div>}
  </section>;
}

export function ProfessionalAvailabilityScreen({ tokens }: { tokens: AuthTokens }) {
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [blocks, setBlocks] = useState<Array<{id:string;locationId:number;startsAt:string;endsAt:string}>>([]);
  const [appointments,setAppointments]=useState<AppointmentResult[]>([]);
  const [locationId, setLocationId] = useState('');
  const [agendaLocation,setAgendaLocation]=useState('');
  const [agendaFrom,setAgendaFrom]=useState('');
  const [agendaTo,setAgendaTo]=useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [editingBlock,setEditingBlock]=useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const load = async () => {
    try {
      const [l, b, a] = await Promise.all([getLocations(tokens), professionalBlocks(tokens), professionalAppointments(tokens, {from:agendaFrom||undefined,to:agendaTo||undefined,locationId:agendaLocation?Number(agendaLocation):undefined})]);
      setLocations(l); setBlocks(b); setAppointments(a);
    } catch(e) { setError(reportError(e)); }
  };
  useEffect(() => { void load(); }, [tokens.accessToken,agendaFrom,agendaTo,agendaLocation]);
  const save = async (event:FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const value={locationId:Number(locationId),startsAt,endsAt};
      if(editingBlock) await updateProfessionalBlock(tokens,editingBlock,value); else await createProfessionalBlock(tokens,value);
      setStartsAt(''); setEndsAt(''); setEditingBlock(''); await load();
    } catch(e) { setError(reportError(e)); } finally { setLoading(false); }
  };
  const edit = (block:typeof blocks[number]) => { setEditingBlock(block.id); setLocationId(String(block.locationId)); setStartsAt(block.startsAt.slice(0,16)); setEndsAt(block.endsAt.slice(0,16)); };
  const remove = async (id:string) => { try { await deleteProfessionalBlock(tokens,id); await load(); } catch(e) { setError(reportError(e)); } };
  const [closing,setClosing]=useState(''); const [historyId,setHistoryId]=useState('');
  const close = async (id:string,status:'COMPLETED'|'NO_SHOW') => { setClosing(id); setError(''); try { await closeProfessionalAppointment(tokens,id,status); await load(); } catch(e) { setError(reportError(e)); } finally { setClosing(''); } };
  return <section className="mx-auto w-full max-w-6xl space-y-6">
    <h1 className="text-3xl font-bold text-[#001549]">Mi agenda</h1>
    {error && <div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}
    <form className={`${card} grid gap-4 sm:grid-cols-3`} onSubmit={save}>
      <label className="text-sm font-semibold">Sede<select className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" required value={locationId} onChange={e=>setLocationId(e.target.value)}><option value="">Selecciona</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Inicio<input className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" type="datetime-local" required value={startsAt} onChange={e=>setStartsAt(e.target.value)} /></label>
      <label className="text-sm font-semibold">Fin<input className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" type="datetime-local" required value={endsAt} onChange={e=>setEndsAt(e.target.value)} /></label>
      <div className="flex gap-2"><button className={button} disabled={loading}>{loading?'Guardando…':editingBlock?'Guardar bloque':'Publicar bloque'}</button>{editingBlock&&<button type="button" className="rounded-xl bg-[#e9e7ef] px-4 py-2.5 text-sm" onClick={()=>{setEditingBlock('');setStartsAt('');setEndsAt('');}}>Cancelar edición</button>}</div>
    </form>
    <h2 className="text-xl font-bold text-[#001549]">Bloques publicados</h2>
    <div className="space-y-3">{blocks.map(b=><article key={b.id} className={`${card} flex flex-wrap justify-between gap-3`}><p>{dateOf(b.startsAt)} · {timeOf(b.startsAt)}–{timeOf(b.endsAt)} · {locations.find(l=>l.id===b.locationId)?.name}</p><div className="flex gap-3"><button className="text-sm font-semibold text-[#0056c3]" onClick={()=>edit(b)}>Editar</button><button className="text-sm font-semibold text-[#93000a]" onClick={()=>void remove(b.id)}>Eliminar</button></div></article>)}{blocks.length===0&&<p className={`${card} text-sm text-[#757682]`}>No hay bloques publicados.</p>}</div>
    <div className={`${card} grid gap-3 sm:grid-cols-3`}>
      <label className="text-sm font-semibold">Desde<input className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" type="date" value={agendaFrom} onChange={e=>setAgendaFrom(e.target.value)}/></label>
      <label className="text-sm font-semibold">Hasta<input className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" type="date" value={agendaTo} onChange={e=>setAgendaTo(e.target.value)}/></label>
      <label className="text-sm font-semibold">Sede<select className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={agendaLocation} onChange={e=>setAgendaLocation(e.target.value)}><option value="">Todas</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
    </div>
    <h2 className="text-xl font-bold text-[#001549]">Citas aprobadas</h2>
    <div className="space-y-3">{appointments.map(item=>{const ended=new Date(item.endsAt)<=new Date();const closable=item.status==='APPROVED';const disabled=!ended||!!item.reschedulePending||closing===item.id;return <article key={item.id} className={card}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{item.patientName} · {item.specialty}</p><p className="text-sm text-[#444651]">{dateOf(item.startsAt)} · {timeOf(item.startsAt)} · {item.location}</p></div><div className="flex flex-wrap items-center gap-2">{item.reschedulePending&&<span className="text-xs font-semibold text-[#684900]">Reprogramación pendiente de decisión</span>}{!closable&&<span className="rounded-full bg-[#dce1ff] px-3 py-1 text-xs font-semibold text-[#00164d]">{statusLabels[item.status]??item.status}</span>}<button className="rounded-xl bg-[#f4f3fa] px-3 py-2 text-xs font-semibold text-[#001549]" onClick={()=>setHistoryId(historyId===item.id?'':item.id)}>Historial</button>{closable&&<><button className="rounded-xl bg-[#dcefe4] px-3 py-2 text-xs font-semibold text-[#006c49] disabled:opacity-50" disabled={disabled} onClick={()=>void close(item.id,'COMPLETED')}>Atendida</button><button className="rounded-xl bg-[#ffdad6] px-3 py-2 text-xs font-semibold text-[#93000a] disabled:opacity-50" disabled={disabled} onClick={()=>void close(item.id,'NO_SHOW')}>No asistió</button></>}</div></div>{closable&&!ended&&<p className="mt-2 text-xs text-[#757682]">Podrás cerrar la atención cuando la cita haya terminado.</p>}{historyId===item.id&&<HistoryPanel tokens={tokens} appointmentId={item.id} onClose={()=>setHistoryId('')}/>}</article>;})}{appointments.length===0&&<p className={`${card} text-sm text-[#757682]`}>No hay citas aprobadas.</p>}</div>
  </section>;
}

const inboxKey = (item: InboxItem) => `${item.type}-${item.id}`;

export function AdminRequestsScreen({ tokens, initialType = '' }: { tokens: AuthTokens; initialType?: InboxType | '' }) {
  const [items,setItems]=useState<InboxItem[]|null>(null); const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [reasons,setReasons]=useState<Record<string,string>>({}); const [busy,setBusy]=useState(''); const [historyKey,setHistoryKey]=useState('');
  const [filter,setFilter]=useState({type:initialType as InboxType|'',locationId:'',professionalId:'',specialtyId:'',from:'',to:''});
  const [locations,setLocations]=useState<ClinicLocation[]>([]); const [professionals,setProfessionals]=useState<Professional[]>([]); const [specialties,setSpecialties]=useState<Specialty[]>([]);
  useEffect(()=>{ void getLocations(tokens).then(setLocations).catch(()=>undefined); void getProfessionals(tokens,true).then(setProfessionals).catch(()=>undefined); void getSpecialties(tokens).then(setSpecialties).catch(()=>undefined); },[tokens.accessToken]);
  const load=async()=>{setError('');setItems(null);try { setItems(await adminInbox(tokens,{type:filter.type,locationId:filter.locationId?Number(filter.locationId):undefined,professionalId:filter.professionalId||undefined,specialtyId:filter.specialtyId?Number(filter.specialtyId):undefined,from:filter.from||undefined,to:filter.to||undefined})); } catch(e){setError(reportError(e));setItems([]);}};
  useEffect(()=>{void load();},[tokens.accessToken,filter.type,filter.locationId,filter.professionalId,filter.specialtyId,filter.from,filter.to]);
  const decide=async(item:InboxItem,approve:boolean)=>{const key=inboxKey(item);const reason=(reasons[key]??'').trim();setMessage('');if(!approve&&!reason){setError('El motivo de rechazo es obligatorio.');return;}setError('');setBusy(key);try {if(item.type==='RESCHEDULE') await decideReschedule(tokens,item.id,approve,reason||undefined); else await decideAppointment(tokens,item.id,approve,reason||undefined);setReasons(current=>({...current,[key]:''}));setMessage(approve?'Solicitud aprobada.':'Solicitud rechazada.');await load();}catch(e){setError(reportError(e));}finally{setBusy('');}};
  const set=(key:keyof typeof filter)=>(e:{target:{value:string}})=>setFilter({...filter,[key]:e.target.value});
  const title=filter.type==='RESCHEDULE'?'Reprogramaciones pendientes':filter.type==='APPOINTMENT'?'Citas especializadas pendientes':'Solicitudes pendientes';
  return <section className="mx-auto w-full max-w-7xl space-y-6"><div><p className="text-xs font-bold uppercase text-[#0056c3]">Administración</p><h1 className="mt-1 text-3xl font-bold text-[#001549]">{title}</h1></div>
    {error&&<div role="alert" className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a]">{error}</div>}{message&&<div role="status" className="rounded-xl bg-[#dcefe4] p-4 text-sm text-[#006c49]">{message}</div>}
    <div className={`${card} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
      <label className="text-sm font-semibold">Tipo<select className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.type} onChange={set('type')}><option value="">Todos</option><option value="APPOINTMENT">Citas especializadas</option><option value="RESCHEDULE">Reprogramaciones</option></select></label>
      <label className="text-sm font-semibold">Sede<select className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.locationId} onChange={set('locationId')}><option value="">Todas</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Profesional<select className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.professionalId} onChange={set('professionalId')}><option value="">Todos</option>{professionals.map(p=><option key={p.id} value={p.id}>{p.givenNames} {p.familyNames}</option>)}</select></label>
      <label className="text-sm font-semibold">Especialidad<select className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.specialtyId} onChange={set('specialtyId')}><option value="">Todas</option>{specialties.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label className="text-sm font-semibold">Desde<input type="date" className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.from} onChange={set('from')}/></label>
      <label className="text-sm font-semibold">Hasta<input type="date" className="mt-1 w-full rounded-xl bg-[#f4f3fa] p-3" value={filter.to} onChange={set('to')}/></label>
    </div>
    {items===null&&<p className={`${card} text-sm text-[#757682]`}>Cargando solicitudes...</p>}
    {items?.map(item=>{const key=inboxKey(item);return <article key={key} aria-label={`Solicitud ${item.patientName}`} className={card}><div className="flex flex-wrap justify-between gap-4"><div><span className="rounded-full bg-[#dce1ff] px-3 py-1 text-xs font-semibold text-[#00164d]">{item.type==='RESCHEDULE'?'Reprogramación':'Cita especializada'}</span><p className="mt-2 font-bold text-[#001549]">{item.patientName} · {item.specialty} · {item.professionalName}</p><p className="text-sm text-[#444651]">{item.location} · {item.type==='RESCHEDULE'?`Anterior: ${item.previousStartsAt?.replace('T',' ')??'—'} · Nueva: `:''}{dateOf(item.startsAt)} {timeOf(item.startsAt)}</p>{item.reason&&<p className="text-sm text-[#757682]">{item.reason}</p>}</div><div className="flex flex-wrap items-start gap-2"><button className="rounded-xl bg-[#f4f3fa] px-3 py-2 text-xs font-semibold text-[#001549]" onClick={()=>setHistoryKey(historyKey===key?'':key)}>Historial</button><button disabled={busy!==''} className="rounded-xl bg-[#ffdad6] px-3 py-2 text-xs font-semibold text-[#93000a] disabled:opacity-50" onClick={()=>void decide(item,false)}>Rechazar</button><button disabled={busy!==''} className={button} onClick={()=>void decide(item,true)}>{busy===key?'Procesando…':'Aprobar'}</button></div></div><label className="mt-3 block text-sm font-semibold">Motivo para rechazar<textarea className="mt-1 block w-full rounded-xl bg-[#f4f3fa] p-3" value={reasons[key]??''} onChange={e=>setReasons({...reasons,[key]:e.target.value})} maxLength={500}/></label>{historyKey===key&&<HistoryPanel tokens={tokens} appointmentId={item.appointmentId} onClose={()=>setHistoryKey('')}/>}</article>;})}
    {items&&items.length===0&&!error&&<p className={`${card} text-sm text-[#757682]`}>No hay solicitudes pendientes para los filtros seleccionados.</p>}
  </section>;
}
