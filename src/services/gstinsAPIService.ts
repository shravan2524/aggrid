import { TenantApiRequest } from '../app/utils/ApiRequests';

/*
[
  {
    "id": 1,
    "sys_gstin_id": 1,
    "name": "",
    "parent": 1,
    "customer_id": 1
  }
]
*/
export interface GstinsType {
  id: number,
  panId: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export interface GstinsAgGridType {
  id: number,
  panId: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export async function fetchGstinsData(): Promise<GstinsType[]> {
  return TenantApiRequest('gstins');
}

export async function postGstinsData(payload): Promise<GstinsType[]> {
  return TenantApiRequest('gstins', 'POST', payload);
}

export async function putGstinsData(payload): Promise<number[]> {
  return TenantApiRequest(`gstins/${payload.id}`, 'PUT', payload.data);
}
