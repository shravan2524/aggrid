import { BACKEND_API } from '../app/config';

/*
[
  {
    "id": 1,
    "uuid": "123456789",
    "title": "Customer 1",
    "parent": null,
    "createdAt": "2022-05-27T07:18:53.339Z",
    "updatedAt": "2022-05-27T07:18:53.339Z"
  },
]
*/
export interface CustomersType {
  id: number,
  uuid: string,
  title: string,
  createdAt: string,
  updatedAt: string,
}

export async function fetchCustomersData() :Promise<CustomersType[]> {
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
