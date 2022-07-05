import { BACKEND_API } from '../app/config';
import { handleRequestError } from '../app/utils/ApiRequests';

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
    await handleRequestError(response);
  }
  return response.json();
}
