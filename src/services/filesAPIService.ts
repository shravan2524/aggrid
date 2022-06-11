import { BACKEND_API } from '../app/config';

export interface FilesType {
  customer_file_name: string,
  file_type: string,
}

export interface FilesAgGridType {
  customer_file_name: string,
  file_type: string,
}

export async function fetchFilesData() :Promise<FilesType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const res = [
    {
      customer_file_name: 'xyz',
      file_type: '2A',
    },
    {
      customer_file_name: 'xyz',
      file_type: '2A',
    },
    {
      customer_file_name: 'xyz',
      file_type: '2A',
    },
  ];
  const apiUrl = `${BACKEND_API}/api/v1/files`;
  const response = await fetch(apiUrl, options);
  console.log('hi');
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return res;
}

export async function putFilesData(payload) :Promise<FilesType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/files/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function updateContentType(payload) :Promise<FilesType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ ...payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/files/${payload.id}`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
