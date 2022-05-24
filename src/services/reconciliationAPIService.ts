import { BACKEND_API } from '../app/config';

export interface ReconciliationType {

}

// TODO: This api doesn't exist yet
export async function fetchReconciliationData() :Promise<ReconciliationType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/reconciliation`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
