import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';
import { CompaniesAgGridType, CompaniesType } from 'services/companiesAPIService';
import { CustomersAgGridType, CustomersType } from 'services/customersAPIService';
import { FilesAgGridType, FilesType } from 'services/filesAPIService';

export function agGridRowDrag(params) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
}

export function agGridDateFormatter(params: ValueFormatterParams) {
  return moment(params.value).format('LLL');
}

export function agGridCompaniesDTO(companies : CompaniesType[]): CompaniesAgGridType[] {
  return companies.map(({
    id,
    name,
    parent,
    customer_id,
  }) => ({
    id,
    name,
    parent,
    customer_id,
  }));
}

export function agGridCustomersDTO(companies : CustomersType[]): CustomersAgGridType[] {
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

export function agGridFilesDTO(companies : FilesType[]): FilesAgGridType[] {
  return companies.map(({
    customer_file_name,
    file_type,
  }) => ({
    customer_file_name,
    file_type,
  }));
}
