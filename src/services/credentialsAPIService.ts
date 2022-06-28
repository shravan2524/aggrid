import { BACKEND_API } from '../app/config';
import { tenantUuid } from '../state/tenants/helper';

export interface CredentialsType {
  company_id: number,
  credentials: {
    username: string,
    password: string,
  }
}

export async function fetchCompanyCredentialsData(companyId: number) :Promise<CredentialsType> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/company-credentials/${companyId}`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function postCompanyCredentialsData(companyId, data) :Promise<CredentialsType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/company-credentials/${companyId}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function putCompanyCredentialsData(companyId, payload) :Promise<CredentialsType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/company-credentials/${companyId}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
