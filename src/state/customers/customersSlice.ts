import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { CustomersType, fetchCustomersData } from 'services/customersAPIService';
import { CustomerTopMenuSelectItemType } from 'parts/menu/CustomerTopMenuSelect';
import ProgressBar from 'app/utils/ProgressBar';

// Types ...
type CustomersState = {
  rows: CustomersType[];
  isLoading: boolean;
  status: string | null;
  selectedCustomer: CustomersType | null;
  error: string | null | undefined;
};

const initialState: CustomersState = {
  rows: [],
  isLoading: false,
  status: null,
  selectedCustomer: null,
  error: undefined,
};

// API Actions ...
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => fetchCustomersData());

// Reducers ...
export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state: Draft<CustomersState>, action: PayloadAction<string | number>) => {
      const customerId = action.payload;
      const selectedCustomerObject = state.rows.find((c) => c.id === Number(customerId));
      if (selectedCustomerObject) {
        state.selectedCustomer = selectedCustomerObject;
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchCustomers.pending, (state: Draft<CustomersState>, action) => {
        state.status = 'loading';
        state.isLoading = true;
        ProgressBar.start();
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.rows = action.payload;

        // if there is no selected item select first customer as default
        const { selectedCustomer, rows } = state;
        if (!selectedCustomer && rows.length) {
          // eslint-disable-next-line prefer-destructuring
          state.selectedCustomer = rows[0];
        }
        state.status = 'succeeded';
        state.isLoading = false;
        ProgressBar.done();
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isLoading = false;
        ProgressBar.done();
      });
  },
});

export default customersSlice.reducer;

// Selectors ...
const CustomersSelector = (state) => state.customers;
export const selectAllCustomers = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomerTopMenuSelectItemType[] => customers.rows.map((i:CustomersType) => ({ value: i.id, label: i.title })),
);

export const selectSelectedCustomer = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomerTopMenuSelectItemType | undefined => (customers.selectedCustomer ? ({ value: customers.selectedCustomer.id, label: customers.selectedCustomer.title }) : undefined),
);

export const getSelectedCustomer = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomersType | null => (customers.selectedCustomer),
);

export const selectSelectedCustomers = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomerTopMenuSelectItemType[] => customers.rows.map((i) => ({ value: i.id, label: i.title })),
);

// Reducer actions ...
const { setSelectedCustomer } = customersSlice.actions;
export { setSelectedCustomer };
