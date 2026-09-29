import { AuthTokens } from './authApi';

export interface CatalogEntry { id:number; code:string; name:string; active:boolean; }
export interface PlanEntry { id:number; epsId:number; code:string; name:string; active:boolean; }
export interface SpecialtyEntry { id:number; code:string; name:string; durationMinutes:number; active:boolean; }
export interface Affiliation { epsId:number; epsName:string; planId:number; planName:string; regimeCode:string; regimeName:string; }
const base=(import.meta.env.VITE_API_URL??'http://localhost:8080').replace(/\/$/,'');
async function call<T>(tokens:AuthTokens,path:string,init?:RequestInit):Promise<T>{let response:Response;try{response=await fetch(`${base}${path}`,{...init,headers:{Accept:'application/json, application/problem+json',Authorization:`Bearer ${tokens.accessToken}`,...(init?.body?{'Content-Type':'application/json'}:{}),...init?.headers}});}catch{throw new Error('No fue posible conectar con el servicio de citas.');}if(response.ok){if(response.status===204)return undefined as T;const body=await response.text();return body?JSON.parse(body) as T:undefined as T;}const problem=await response.json().catch(()=>null) as {detail?:string}|null;throw new Error(problem?.detail??'No fue posible completar la solicitud.');}
export const listEps=(tokens:AuthTokens,admin:boolean)=>call<CatalogEntry[]>(tokens,admin?'/api/v1/admin/eps':'/api/v1/eps');
export const saveEps=(tokens:AuthTokens,value:{code:string;name:string},id?:number)=>call<CatalogEntry>(tokens,id?`/api/v1/admin/eps/${id}`:'/api/v1/admin/eps',{method:id?'PUT':'POST',body:JSON.stringify(value)});
export const activateEps=(tokens:AuthTokens,id:number,active:boolean)=>call<CatalogEntry>(tokens,`/api/v1/admin/eps/${id}/active`,{method:'PATCH',body:JSON.stringify({active})});
export const listPlans=(tokens:AuthTokens,epsId:number,admin:boolean)=>call<PlanEntry[]>(tokens,`/api/v1/${admin?'admin/':''}eps/${epsId}/plans`);
export const savePlan=(tokens:AuthTokens,epsId:number,value:{code:string;name:string},id?:number)=>call<PlanEntry>(tokens,id?`/api/v1/admin/plans/${id}`:`/api/v1/admin/eps/${epsId}/plans`,{method:id?'PUT':'POST',body:JSON.stringify(id?{...value,epsId}:value)});
export const activatePlan=(tokens:AuthTokens,id:number,active:boolean)=>call<PlanEntry>(tokens,`/api/v1/admin/plans/${id}/active`,{method:'PATCH',body:JSON.stringify({active})});
export const listRegimes=(tokens:AuthTokens,admin:boolean)=>call<CatalogEntry[]>(tokens,admin?'/api/v1/admin/regimes':'/api/v1/regimes');
export const listSpecialties=(tokens:AuthTokens)=>call<SpecialtyEntry[]>(tokens,'/api/v1/specialties');
export const saveRegime=(tokens:AuthTokens,value:{code:string;name:string})=>call<CatalogEntry>(tokens,'/api/v1/admin/regimes',{method:'POST',body:JSON.stringify(value)});
export const updateRegime=(tokens:AuthTokens,code:string,value:{name:string})=>call<CatalogEntry>(tokens,`/api/v1/admin/regimes/${encodeURIComponent(code)}`,{method:'PUT',body:JSON.stringify({code,...value})});
export const activateRegime=(tokens:AuthTokens,code:string,active:boolean)=>call<CatalogEntry>(tokens,`/api/v1/admin/regimes/${encodeURIComponent(code)}/active`,{method:'PATCH',body:JSON.stringify({active})});
export const getAffiliation=(tokens:AuthTokens)=>call<Affiliation|null>(tokens,'/api/v1/profile/affiliation');
export const saveAffiliation=(tokens:AuthTokens,value:{epsId:number;planId:number;regimeCode:string})=>call<Affiliation>(tokens,'/api/v1/profile/affiliation',{method:'PUT',body:JSON.stringify(value)});
export const listAdminSpecialties=(tokens:AuthTokens)=>call<SpecialtyEntry[]>(tokens,'/api/v1/admin/specialties');
export const saveSpecialty=(tokens:AuthTokens,value:{code:string;name:string;durationMinutes:number},id?:number)=>call<SpecialtyEntry>(tokens,id?`/api/v1/admin/specialties/${id}`:'/api/v1/admin/specialties',{method:id?'PUT':'POST',body:JSON.stringify(value)});
export const activateSpecialty=(tokens:AuthTokens,id:number,active:boolean)=>call<SpecialtyEntry>(tokens,`/api/v1/admin/specialties/${id}/active`,{method:'PATCH',body:JSON.stringify({active})});
