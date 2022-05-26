import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { CompaniesType } from 'services/companiesAPIService';
import { CompaniesState } from './companiesTypes';

// Reducers ...
const initialState: CompaniesState = {
  rows: [],
  isLoading: false,
  selectedCompany: null,
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    startLoading: (state: Draft<CompaniesState>) => {
      state.isLoading = true;
    },
    setCompanySuccessResponse: (state: Draft<CompaniesState>, action: PayloadAction<CompaniesType[]>) => {
      state.rows = action.payload;
      state.isLoading = false;
    },
    setSelectedCompany: (state: Draft<CompaniesState>, action:PayloadAction<CompaniesType>) => {
      state.selectedCompany = action.payload;
    },

  },
});

export default companiesSlice.reducer;
