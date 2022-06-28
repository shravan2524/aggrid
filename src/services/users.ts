import { BACKEND_API } from 'app/config';
import { tenantUuid } from 'state/tenants/helper';

export interface ItemType {
  id?: number,
  email: string,
  firstName?: string,
  lastName?: string,
  name?: string,
  status?: string,
  createdAt?: Date,
  createdBy?: number,
  creator?: any | null,
  updatedAt?: Date,
  updatedBy?: number,
  updator?: any | null,
}

export async function readAll(): Promise<ItemType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/users`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurr: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function readOne(id: number): Promise<ItemType> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/users/${id}`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurr: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function create(data: ItemType): Promise<ItemType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/users`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function update(payload: ItemType): Promise<ItemType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/users/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function patch(payload: ItemType): Promise<ItemType> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/users/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
