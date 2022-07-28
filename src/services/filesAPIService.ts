import { BACKEND_API } from 'app/config';
import { tenantUuid } from 'state/tenants/helper';
import { TenantApiRequest } from '../app/utils/ApiRequests';

export interface FilesType {
  id: number,
  fileName: string,
  fileType: string,
  contentType: string,
  columnMapping: Object,
  agGridColumns:any,
  contentPreview:any,
}

export interface FilesAgGridType {
  id: number,
  fileName: string,
  fileType: string,
  columnMapping: Object | undefined,
}

export async function fetchFilesData(): Promise<FilesType[]> {
  // return TenantApiRequest('files');
  const options: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  const apiUrl = `${BACKEND_API}/api/v1/${tenantUuid()}/files/`;
  // const apiUrl = 'https://beta.finkraft.ai/api/v1/f3b4a42c-9ac8-42c3-a5ff-1a6e6da8f5c0/files';
  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    const message = `An error has occurreds: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export async function fetchFileContentData(payload): Promise<any> {
  const temp = TenantApiRequest(`files/${payload.id}/content`, 'POST', payload.dataRequest);
  console.log(temp, 'contentdata');
  return temp;
}

export async function putFilesData(payload): Promise<FilesType[]> {
  return TenantApiRequest(`files/${payload.id}`, 'PUT', payload.data);
}

export async function setContentType(payload): Promise<FilesType[]> {
  return TenantApiRequest(`files/${payload.id}/content-type`, 'PUT', payload.data);
}

export async function setColumnMapping(payload): Promise<FilesType[]> {
  return TenantApiRequest(`files/${payload.data}/column-mapping`, 'PUT', { columnMapping: payload.columnMapping });
}
