import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface PanType {
  id: number,
  pan: string,
  tenantId: number,
  title: string,
}

export interface PanAGGridType extends PanType {
}

export async function fetchPansData(): Promise<PanType[]> {
  return TenantApiRequest('pans');
}

export async function postPansData(data): Promise<PanType[]> {
  return TenantApiRequest('pans', 'POST', data);
}

export async function putPansData(payload): Promise<PanType[]> {
  return TenantApiRequest(`pans/${payload.id}`, 'PUT', payload.data);
}
