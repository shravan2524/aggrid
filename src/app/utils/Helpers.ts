import moment from 'moment';
import { CompaniesAgGridType, CompaniesType } from 'services/companiesAPIService';
import { TenantAGGridType, TenantType } from 'services/tenantsAPIService';
import { FilesAgGridType, FilesType } from 'services/filesAPIService';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function agGridDateFormatter(params) {
  return moment(params).format('LLL');
}

export function agGridCompaniesDTO(companies: CompaniesType[]): CompaniesAgGridType[] {
  return companies.map(({
    id,
    name,
    parent,
    tenantId,
    gstin,
  }) => ({
    id,
    name,
    parent,
    tenantId,
    gstin,
  }));
}

export function agGridTenantsDTO(companies: TenantType[]): TenantAGGridType[] {
  return companies.map(({
    id,
    title,
    createdAt,
    updatedAt,
  }) => ({
    id,
    title,
    createdAt,
    updatedAt,
  }));
}

export function agGridFilesDTO(items: FilesType[]): FilesAgGridType[] {
  return items.map(({
    id,
    fileName,
    fileType,
    columnMapping,
    agGridColumns,
    contentPreview,
  }) => ({
    id,
    fileName,
    fileType,
    columnMapping,
    agGridColumns,
    contentPreview,
  }));
}

export function GetFilename(url?: string | null) {
  if (url) {
    const m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return '';
}

export function DownloadFile(dataUrl?: string | null) {
  if (dataUrl) {
    const filename = GetFilename(dataUrl);
    const req = new XMLHttpRequest();
    req.open('GET', dataUrl, true);
    req.responseType = 'blob';
    req.onload = () => {
      const blob = new Blob([req.response], {
        type: 'application/pdf',
      });

      const windowUrl = window.URL || window.webkitURL;
      const href = windowUrl.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('download', filename);
      a.setAttribute('href', href);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    req.send();
  }
}
