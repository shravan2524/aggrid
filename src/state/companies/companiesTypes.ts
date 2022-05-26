import { CompaniesType } from 'services/companiesAPIService';

export interface CompaniesState {
  rows: CompaniesType[],
  isLoading: boolean,
  selectedCompany: CompaniesType | null,
}
