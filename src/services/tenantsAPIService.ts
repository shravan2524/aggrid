import { BACKEND_API } from '../app/config';

/*
[
  {
    "id": 1,
    "uuid": "123456789",
    "title": "Tenant 1",
    "parent": null,
    "createdAt": "2022-05-27T07:18:53.339Z",
    "updatedAt": "2022-05-27T07:18:53.339Z"
  },
]
*/
export interface TenantType {
  id: number,
  title: string,
  uuid: string,
  createdAt: string,
  updatedAt: string,
}

export interface TenantAGGridType {
  id: number,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export async function fetchTenantsData(): Promise<TenantType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/tenants`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function postTenantsData(data): Promise<TenantType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/tenants`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function putTenantsData(payload): Promise<TenantType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/tenants/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
