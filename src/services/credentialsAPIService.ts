import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface CredentialsType {
  gstinId: number,
  id: number,
  credentials: {
    username: string,
    password: string,
  }
}

export async function fetchGstinCredentialsData(gstinId: number): Promise<CredentialsType> {
  return TenantApiRequest(`gstin-credentials/${gstinId}`);
}

export async function postGstinCredentialsData(gstinId, data): Promise<CredentialsType[]> {
  return TenantApiRequest(`gstin-credentials/${gstinId}`, 'POST', data);
}

export async function putGstinCredentialsData(gstinId, credentialsId, payload): Promise<CredentialsType[]> {
  return TenantApiRequest(`gstin-credentials/${gstinId}/${credentialsId}`, 'PUT', payload);
}
