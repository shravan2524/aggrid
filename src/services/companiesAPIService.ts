import { BACKEND_API } from '../app/config';

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
  sys_company_id: number,
  name: string,
  parent: number,
  customer_id: number,
}

export async function fetchCompaniesData() :Promise<CompaniesType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/companies`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
