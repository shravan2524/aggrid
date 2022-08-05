import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface Folders {
  createdAt?: string;
  updatedAt?: string;
  id?: number;
  title: string;
  tenantId?: number;
  settings?: {};
  modelName?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FoldersContent {
  createdAt?: string;
  filterId: number;
  folderId?: number;
  id?: number;
  filters?: Folders;
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

export async function postFilterInFolderData(payload): Promise<Folders[]> {
  return TenantApiRequest(`folders/${payload.id}/filters`, 'POST', payload);
}

export async function getFilterInFolderData(
  payload,
): Promise<FoldersContent[]> {
  return TenantApiRequest(`folders/${payload}/filters`);
}

export async function removeFilterInFolderData(payload): Promise<Folders[]> {
  return TenantApiRequest(
    `folders/${payload.id}/filter/${payload.filterId}`,
    'DELETE',
  );
}
