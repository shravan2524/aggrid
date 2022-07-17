import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface CredentialsType {
  companyId: number,
  id: number,
  credentials: {
    username: string,
    password: string,
  }
}

export async function fetchCompanyCredentialsData(companyId: number): Promise<CredentialsType> {
  return TenantApiRequest(`company-credentials/${companyId}`);
}

export async function postCompanyCredentialsData(companyId, data): Promise<CredentialsType[]> {
  return TenantApiRequest(`company-credentials/${companyId}`, 'POST', data);
}

export async function putCompanyCredentialsData(companyId, credentialsId, payload): Promise<CredentialsType[]> {
  return TenantApiRequest(`company-credentials/${companyId}/${credentialsId}`, 'PUT', payload);
}
