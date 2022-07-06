import { toast } from 'react-hot-toast';
import { tenantUuid } from 'state/tenants/helper';
import { BACKEND_API, LOGOUT_LINK } from '../config';

/**
 * Handle API Request error as global
 * @param response
 */
export async function handleRequestError(response) {
  const responseCode = response.status;
  let responseText = response.statusText;

  // Reading the error message from the server
  const serverResponsePromise = await response.text();
  const serverResponseData = JSON.parse(serverResponsePromise);

  if (serverResponseData.error) {
    responseText = serverResponseData.error;
  }

  if (responseCode === 401) {
    toast.error('HTTP Error 401 - Unauthorized.');
    window.location.href = LOGOUT_LINK;
  } else {
    toast.error(`HTTP Error ${responseCode} ${responseText}`);
  }
  throw new Error(`HTTP Error ${responseCode} ${responseText}`);
}

/**
 * Global API Request wrapper
 * @param apiURI
 * @param methodType
 * @param bodyData
 * @constructor
 */
export async function ApiRequest(apiURI: string, methodType = 'GET', bodyData: object | null = null): Promise<any | any[]> {
  const requestAPIUrl = `${BACKEND_API}/api/v1/${apiURI}`;

  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: methodType.toUpperCase(),
    credentials: 'include',
  };

  if (bodyData) {
    options.body = JSON.stringify({ ...bodyData });
  }

  const response = await fetch(requestAPIUrl, options);

  if (!response.ok) {
    await handleRequestError(response);
  }
  return response.json();
}

/**
 * Global Api Request wrapper using Tenant ID
 * @param apiURI
 * @param methodType
 * @param bodyData
 * @constructor
 */
export async function TenantApiRequest(apiURI: string, methodType = 'GET', bodyData: object | null = null) : Promise<any | any[]> {
  return ApiRequest(`${tenantUuid()}/${apiURI}`, methodType, bodyData);
}
