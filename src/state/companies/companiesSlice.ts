import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import {
  CompaniesType, fetchCompaniesData, postCompaniesData, putCompaniesData,
} from 'services/companiesAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';
import { CustomerTopMenuSelectItemType } from 'parts/menu/CustomerTopMenuSelect';

// Types ...
export type CompaniesState = {
  rows: CompaniesType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedCompany: CompaniesType | null;
  selectedCompanies: CompaniesType[],
  error: string | null | undefined;
};

const initialState: CompaniesState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedCompany: null,
  selectedCompanies: [],
  error: undefined,
};

// API Actions ...
export const fetchCompanies = createAsyncThunk('getCompanies', async () => fetchCompaniesData());
export const newCompanyRequest = createAsyncThunk('postCompanies', async (data: any) => postCompaniesData(data));
export const updateCompanyRequest = createAsyncThunk('putCompanies', async (payload: any) => putCompaniesData(payload));

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
    setSelectedCompanies: (state: Draft<CompaniesState>, action: PayloadAction<CompaniesType[]>) => {
      const selectedCompanies = action.payload ? action.payload : [];
      state.selectedCompanies = selectedCompanies;

      if (selectedCompanies.length) {
        // eslint-disable-next-line prefer-destructuring
        state.selectedCompany = selectedCompanies[0];
      } else {
        // @ts-ignore
        state.selectedCompany = [];
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

    // Update Company ...
    builder.addCase(updateCompanyRequest.pending, (state: Draft<CompaniesState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateCompanyRequest.fulfilled, (state, action) => {
      toast.success('Company successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateCompanyRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default companiesSlice.reducer;

// Selectors ...
const CompaniesSelector = (state) => state.companies;

export const getCompanies = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CompaniesType[] => companies.rows,
);

export const getSelectedCompanies = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CompaniesType[] => companies.selectedCompanies,
);

export const selectAllCompanies = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CustomerTopMenuSelectItemType[] => companies.rows.map((i) => ({ value: i.id, label: i.name })),
);

export const selectSelectedCompany = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CustomerTopMenuSelectItemType | undefined => (companies.selectedCompany ? ({ value: companies.selectedCompany.id, label: companies.selectedCompany.name }) : undefined),
);

export const selectSelectedCompanies = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): CustomerTopMenuSelectItemType[] => companies.selectedCompanies.map((i) => ({ value: i.id, label: i.name })),
);

export const isLoadingSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): boolean | undefined => companies.isLoading,
);

export const isPostLoadingSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): boolean | undefined => companies.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): boolean | undefined => companies.isPutLoading,
);

export const selectErrorMessageSelector = createSelector(
  CompaniesSelector,
  (companies: CompaniesState): string | null | undefined => companies.error,
);

// Reducer actions ...
const { setSelectedCompany, setSelectedCompanies } = companiesSlice.actions;
export { setSelectedCompany, setSelectedCompanies };
