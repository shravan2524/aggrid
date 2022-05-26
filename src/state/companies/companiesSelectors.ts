import { createSelector } from '@reduxjs/toolkit';
import { CompaniesType } from 'services/companiesAPIService';
import { CompaniesState } from './companiesTypes';

const CompaniesSelector = (state) => state.companies;

export const getCompaniesSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState) : CompaniesType[] => companies.rows,
);

/*
export const getCompaniesErrorResponseSelector = createSelector(
  CompanySelector,
  (company: CompaniesState) => company.errorResponse,
);

export const getSelectedCompanySelector = createSelector(
  CompanySelector,
  (company: CompaniesState) => company.selectedCompany,
);
*/
