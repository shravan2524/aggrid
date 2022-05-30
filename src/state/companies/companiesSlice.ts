import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { CompaniesType, fetchCompaniesData, postCompaniesData } from 'services/companiesAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

// Types ...
export type CompaniesState = {
  rows: CompaniesType[];
  isLoading: boolean;
  isPostLoading: boolean;
  selectedCompany: CompaniesType | null;
  error: string | null | undefined;
};

const initialState: CompaniesState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  selectedCompany: null,
  error: undefined,
};

// API Actions ...
export const fetchCompanies = createAsyncThunk('fetchCompanies', async () => fetchCompaniesData());
export const newCompanyRequest = createAsyncThunk('postCompanies', async (data: any) => postCompaniesData(data));

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
  extraReducers: (builder) => {
    // Fetch Companies ...
    builder.addCase(fetchCompanies.pending, (state: Draft<CompaniesState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.rows = action.payload;

      // if there is no selected item select first company as default
      const { selectedCompany, rows } = state;
      if (!selectedCompany && rows.length) {
        // eslint-disable-next-line prefer-destructuring
        state.selectedCompany = rows[0];
      }
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isLoading = false;
      ProgressBar.done();
    });

    // Add new Company ...
    builder.addCase(newCompanyRequest.pending, (state: Draft<CompaniesState>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(newCompanyRequest.fulfilled, (state, action) => {
      toast.success('Company successfully created.');
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(newCompanyRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPostLoading = false;
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
export const isLoadingSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): boolean | undefined => companies.isLoading,
);

export const isPostLoadingSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): boolean | undefined => companies.isPostLoading,
);

export const selectErrorMessageSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): string | null | undefined => companies.error,
);

// Reducer actions ...
const { setSelectedCompany } = companiesSlice.actions;
export { setSelectedCompany };
