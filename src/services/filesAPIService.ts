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
  return TenantApiRequest('files');
}

export async function fetchFileContentData(payload): Promise<any> {
  return TenantApiRequest(`files/${payload.id}/content`, 'POST', payload.data);
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
