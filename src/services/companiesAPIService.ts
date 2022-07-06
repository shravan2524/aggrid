import { TenantApiRequest } from '../app/utils/ApiRequests';

/*
[
  {
    "id": 1,
    "sys_company_id": 1,
    "name": "",
    "parent": 1,
    "customer_id": 1
  }
]
*/
export interface CompaniesType {
  id: number,
  sysCompanyId: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export interface CompaniesAgGridType {
  id: number,
  name: string,
  parent: number,
  gstin: string,
  tenantId: number,
}

export async function fetchCompaniesData(): Promise<CompaniesType[]> {
  return TenantApiRequest('companies');
}

export async function postCompaniesData(payload): Promise<CompaniesType[]> {
  return TenantApiRequest('companies', 'POST', payload);
}

export async function putCompaniesData(payload): Promise<number[]> {
  return TenantApiRequest(`companies/${payload.id}`, 'PUT', payload.data);
}
