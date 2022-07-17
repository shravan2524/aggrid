import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface PolicyType {
  // action: "crud" or "cru" or "r" or "cr" or "rd" ... meaning c(reate), r(ead), u(pdate), d(delete)
  a: string,
  // page: "files", "users", "roles", ...
  p: string,
  // array of objects
  f: Array<any>,
}

export interface RoleType {
  id?: number,
  title: string,
  policies: Array<PolicyType>,
  createdAt?: Date,
  createdBy?: number,
  creator?: any | null,
  updatedAt?: Date,
  updatedBy?: number,
  updator?: any | null,
}

export async function readAll(): Promise<RoleType[]> {
  return TenantApiRequest('roles');
}

export async function readOne(id: number): Promise<RoleType[]> {
  return TenantApiRequest(`roles/${id}`);
}

export async function create(data: RoleType): Promise<RoleType> {
  return TenantApiRequest('roles', 'POST', data);
}

export async function update(payload: RoleType): Promise<RoleType> {
  return TenantApiRequest(`roles/${payload.id}`, 'PUT', payload);
}

export async function patch(payload: RoleType): Promise<RoleType> {
  return TenantApiRequest(`roles/${payload.id}`, 'PATCH', payload);
}
