import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export interface ColumnGroupType {
}

export async function fetchColumnGroup(): Promise<ColumnGroupType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/columngroups`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function postColumnGroup(payload): Promise<ColumnGroupType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ ...payload.Comments }),
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/columngroups/`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
