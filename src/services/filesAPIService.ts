import { BACKEND_API } from '../app/config';

export interface FilesType {
  id: number,
  fileName: string,
  fileType: string,
  contentType: string,
  columnMapping: Object,
}

export interface FilesAgGridType {
  id: number,
  fileName: string,
  fileType: string,
  contentType: string | undefined,
  columnMapping: Object | undefined,
}

export async function fetchFilesData(): Promise<FilesType[]> {
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const res = [
    {
      id: 134,
      fileName: 'xyz',
      fileType: '2A',
      contentType: '2A',
      columnMapping: '223432',
    },
    {
      id: 134,
      fileName: 'xyz',
      fileType: '2A',
      contentType: '2A',
      columnMapping: '223432',
    },
    {
      id: 134,
      fileName: 'xyz',
      fileType: '2A',
      contentType: '2A',
      columnMapping: '223432',
    },
  ];
  const apiUrl = `${BACKEND_API}/api/v1/files`;
  const response = await fetch(apiUrl, options);
  // console.log('hi');
  console.log(res);
  return res;
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return res;
}

export async function putFilesData(payload): Promise<FilesType[]> {
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

export async function setContentType(payload): Promise<FilesType[]> {
  console.log('payload', payload);
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ fileType: payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/files/${payload.id}/content-type`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function setColumnMapping(payload): Promise<FilesType[]> {
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ columnMapping: payload.data }),
  };

  const apiUrl = `${BACKEND_API}/api/v1/files/${payload.id}/column-mapping`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
