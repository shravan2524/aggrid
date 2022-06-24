import { BACKEND_API } from 'app/config';
import { tenantUuid } from 'state/tenants/helper';

/*
[
  {
    "id": 1,
    "sys_company_id": 1,
    "name": "",
    "parent": 1,
    "customer_id": 1
  }
]
*/
export interface CompaniesType {
  id: number,
  sysCompanyId: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export interface CompaniesAgGridType {
  id: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export async function fetchCompaniesData(): Promise<CompaniesType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/companies`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurr: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function postCompaniesData(data): Promise<CompaniesType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/companies`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function putCompaniesData(payload): Promise<CompaniesType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/companies/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
