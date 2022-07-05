import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export async function fetchUserMeData() {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const response = await fetch(`${BACKEND_API}/api/v1/auth/me`, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

export async function fetchUserDataForTenant(tenantUuid) {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const response = await fetch(`${BACKEND_API}/api/v1/auth/me/${tenantUuid}`, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
