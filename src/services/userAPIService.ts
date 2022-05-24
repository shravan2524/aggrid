import { BACKEND_API } from '../app/config';

export async function fetchUserMeData() {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const response = await fetch(`${BACKEND_API}/api/v1/me`, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
