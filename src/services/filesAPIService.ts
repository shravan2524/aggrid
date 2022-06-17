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
  // const apiUrl = `${BACKEND_API}/api/v1/files`;
  const apiUrl = 'https://beta.finkraft.ai/api/v1/files';
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurreds: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
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
  let data1;
  if (payload.data === 'GSTR2B') {
    data1 = '2B';
  } else if (payload.data === 'GSTR2A') {
    data1 = '2A';
  } else if (payload.data === 'Purchase Register') {
    data1 = 'PR';
  } else {
    data1 = 'invoicePDF';
  }
  console.log(data1);
  const options: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ fileType: payload.data1 }),
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
    body: JSON.stringify({ columnMapping: payload.columnMapping }),
  };

  // const apiUrl = `https://beta.finkraft.ai/api/v1/files/${payload.data}/column-mapping`;
  const apiUrl = `${BACKEND_API}/api/v1/files/${payload.data}/column-mapping`;
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}
