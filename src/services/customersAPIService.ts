import { BACKEND_API } from '../app/config';

/*
[
  {
    "id": 1,
    "uuid": "",
    "title": "",
    "parent": 1
  }
]
*/
export interface CustomersType {
  id: number,
  uuid: string,
  title: string,
  parent: number,
}

export async function fetchCustomersData() :Promise<CustomersType[] | null | Error> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };

  const apiUrl = `${BACKEND_API}/api/v1/customers`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
