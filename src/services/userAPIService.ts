import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

export async function fetchUserMeData() {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const response = await fetch(`${BACKEND_API}/api/v1/me`, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}
