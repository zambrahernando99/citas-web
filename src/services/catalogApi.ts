import { AuthTokens } from './authApi';
import { apiRequest } from './http';

export interface CatalogEntry { id:number; code:string; name:string; active:boolean; }
export interface PlanEntry { id:number; epsId:number; code:string; name:string; active:boolean; }
export interface SpecialtyEntry { id:number; code:string; name:string; durationMinutes:number; active:boolean; }
export interface Affiliation { epsId:number; epsName:string; planId:number; planName:string; regimeCode:string; regimeName:string; }
const call=<T>(tokens:AuthTokens,path:string,init?:{method?:string;body?:unknown})=>apiRequest<T>(path,{...init,tokens});
export const listEps=(tokens:AuthTokens,admin:boolean)=>call<CatalogEntry[]>(tokens,admin?'/api/v1/admin/eps':'/api/v1/eps');
export const saveEps=(tokens:AuthTokens,value:{code:string;name:string},id?:number)=>call<CatalogEntry>(tokens,id?`/api/v1/admin/eps/${id}`:'/api/v1/admin/eps',{method:id?'PUT':'POST',body:value});
export const activateEps=(tokens:AuthTokens,id:number,active:boolean)=>call<CatalogEntry>(tokens,`/api/v1/admin/eps/${id}/active`,{method:'PATCH',body:{active}});
export const listPlans=(tokens:AuthTokens,epsId:number,admin:boolean)=>call<PlanEntry[]>(tokens,`/api/v1/${admin?'admin/':''}eps/${epsId}/plans`);
export const savePlan=(tokens:AuthTokens,epsId:number,value:{code:string;name:string},id?:number)=>call<PlanEntry>(tokens,id?`/api/v1/admin/plans/${id}`:`/api/v1/admin/eps/${epsId}/plans`,{method:id?'PUT':'POST',body:id?{...value,epsId}:value});
export const activatePlan=(tokens:AuthTokens,id:number,active:boolean)=>call<PlanEntry>(tokens,`/api/v1/admin/plans/${id}/active`,{method:'PATCH',body:{active}});
// Regímenes: catálogo fijo de solo lectura (PRD RF-05 / HU-007)
export const listRegimes=(tokens:AuthTokens,admin:boolean)=>call<CatalogEntry[]>(tokens,admin?'/api/v1/admin/regimes':'/api/v1/regimes');
export const listSpecialties=(tokens:AuthTokens)=>call<SpecialtyEntry[]>(tokens,'/api/v1/specialties');
export const getAffiliation=(tokens:AuthTokens)=>call<Affiliation|null>(tokens,'/api/v1/profile/affiliation');
export const saveAffiliation=(tokens:AuthTokens,value:{epsId:number;planId:number;regimeCode:string})=>call<Affiliation>(tokens,'/api/v1/profile/affiliation',{method:'PUT',body:value});
export const listAdminSpecialties=(tokens:AuthTokens)=>call<SpecialtyEntry[]>(tokens,'/api/v1/admin/specialties');
export const saveSpecialty=(tokens:AuthTokens,value:{code:string;name:string;durationMinutes:number},id?:number)=>call<SpecialtyEntry>(tokens,id?`/api/v1/admin/specialties/${id}`:'/api/v1/admin/specialties',{method:id?'PUT':'POST',body:value});
export const activateSpecialty=(tokens:AuthTokens,id:number,active:boolean)=>call<SpecialtyEntry>(tokens,`/api/v1/admin/specialties/${id}/active`,{method:'PATCH',body:{active}});
