import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface Folders {
  createdAt?: string;
  updatedAt?: string;
  id?: number;
  title: string;
  tenantId: number;
  settings?: {};
  modelName?: string;
  createdBy?: string;
  updatedBy?: string;
}

export async function fetchFoldersData(): Promise<Folders[]> {
  return TenantApiRequest('folders');
}

export async function createFoldersData(payload): Promise<Folders[]> {
  return TenantApiRequest('folders', 'POST', payload);
}

export async function putFoldersData(payload): Promise<Folders[]> {
  return TenantApiRequest(`folders/${payload.id}`, 'PUT', payload);
}
