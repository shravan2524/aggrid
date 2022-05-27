import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { CompaniesType, fetchCompaniesData } from 'services/companiesAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { CustomerTopMenuSelectItemType } from '../../parts/menu/CustomerTopMenuSelect';

// Types ...
export type CompaniesState = {
  rows: CompaniesType[];
  isLoading: boolean;
  status: string | null;
  selectedCompany: CompaniesType | null;
  error: string | null | undefined;
};

const initialState: CompaniesState = {
  rows: [],
  isLoading: false,
  status: null,
  selectedCompany: null,
  error: undefined,
};

// API Actions ...
export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async () => fetchCompaniesData());

// Reducers ...
export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompany: (state: Draft<CompaniesState>, action: PayloadAction<string | number | null>) => {
      const companyId = action.payload;

      if (companyId) {
        const selectedCompanyObject = state.rows.find((c) => c.id === Number(companyId));
        if (selectedCompanyObject) {
          state.selectedCompany = selectedCompanyObject;
        }
      } else {
        state.selectedCompany = null;
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchCompanies.pending, (state: Draft<CompaniesState>, action) => {
        state.status = 'loading';
        state.isLoading = true;
        ProgressBar.start();
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.rows = action.payload;

        // if there is no selected item select first company as default
        const { selectedCompany, rows } = state;
        if (!selectedCompany && rows.length) {
          // eslint-disable-next-line prefer-destructuring
          state.selectedCompany = rows[0];
        }
        state.status = 'succeeded';
        state.isLoading = false;
        ProgressBar.done();
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isLoading = false;
        ProgressBar.done();
      });
  },
});

export default companiesSlice.reducer;

// Selectors ...
const CompaniesSelector = (state) => state.companies;

export const getAllCompanies = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CompaniesType[] => companies.rows,
);
export const selectSelectedCompany = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CompaniesType | null => companies.selectedCompany,
);

// Reducer actions ...
const { setSelectedCompany } = companiesSlice.actions;
export { setSelectedCompany };
