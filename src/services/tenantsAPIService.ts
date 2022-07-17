import { ApiRequest } from '../app/utils/ApiRequests';

/*
[
  {
    "id": 1,
    "uuid": "123456789",
    "title": "Tenant 1",
    "parent": null,
    "createdAt": "2022-05-27T07:18:53.339Z",
    "updatedAt": "2022-05-27T07:18:53.339Z"
  },
]
*/
export interface TenantType {
  id: number,
  title: string,
  uuid: string,
  createdAt: string,
  updatedAt: string,
}

export interface TenantAGGridType {
  id: number,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export async function fetchTenantsData(): Promise<TenantType[]> {
  return ApiRequest('tenants');
}

export async function postTenantsData(data): Promise<TenantType[]> {
  return ApiRequest('tenants', 'POST', data);
}

export async function putTenantsData(payload): Promise<TenantType[]> {
  return ApiRequest(`tenants/${payload.id}`, 'PUT', payload.data);
}
