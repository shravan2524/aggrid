import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';
import { CompaniesAgGridType, CompaniesType } from 'services/companiesAPIService';
import { TenantAGGridType, TenantType } from 'services/tenantsAPIService';
import { FilesAgGridType, FilesType } from 'services/filesAPIService';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function agGridDateFormatter(params: ValueFormatterParams) {
  return moment(params.value).format('LLL');
}

export function agGridCompaniesDTO(companies: CompaniesType[]): CompaniesAgGridType[] {
  return companies.map(({
    id,
    name,
    parent,
    tenantId,
  }) => ({
    id,
    name,
    parent,
    tenantId,
  }));
}

export function agGridCustomersDTO(companies: TenantType[]): TenantAGGridType[] {
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
    contentType,
    columnMapping,
  }) => ({
    id,
    fileName,
    fileType,
    contentType,
    columnMapping,
  }));
}
