import { BACKEND_API } from 'app/config';
import { tenantUuid } from 'state/tenants/helper';
import { handleRequestError } from '../app/utils/ApiRequests';

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
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/roles`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function readOne(id: number): Promise<RoleType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/roles/${id}`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function create(data: RoleType): Promise<RoleType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/roles`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function update(payload: RoleType): Promise<RoleType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/roles/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function patch(payload: RoleType): Promise<RoleType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/roles/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
