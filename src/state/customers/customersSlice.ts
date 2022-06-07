import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomersType, fetchCustomersData, postCustomersData, putCustomersData,
} from 'services/customersAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

// Types ...
type CustomersState = {
  rows: CustomersType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedCustomer: number | null;
  error: string | null | undefined;
};

const initialState: CustomersState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedCustomer: null,
  error: undefined,
};

// API Actions ...
export const fetchCustomers = createAsyncThunk('fetchCustomers', async () => fetchCustomersData());
export const newCustomerRequest = createAsyncThunk('postCustomers', async (data: any) => postCustomersData({ ...data, uuid: uuidv4() }));
export const updateCustomerRequest = createAsyncThunk('putCompanies', async (payload: any) => putCustomersData(payload));

// Reducers ...
export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state: Draft<CustomersState>, action: PayloadAction<string | number>) => {
      const selectedCustomer = state.rows.find((i) => Number(i.id) === Number(action.payload));
      state.selectedCustomer = selectedCustomer?.id ?? null;
    },
  },

  extraReducers(builder) {
    // Fetching Customers ...
    builder.addCase(fetchCustomers.pending, (state: Draft<CustomersState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isLoading = false;
      ProgressBar.done();
    });

    // Adding new Company ...
    builder.addCase(newCustomerRequest.pending, (state: Draft<CustomersState>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(newCustomerRequest.fulfilled, (state, action) => {
      toast.success('Workspace successfully created.');
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(newCustomerRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPostLoading = false;
      ProgressBar.done();
    });

    // Update Customer ...
    builder.addCase(updateCustomerRequest.pending, (state: Draft<CustomersState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateCustomerRequest.fulfilled, (state, action) => {
      toast.success('Workspace successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateCustomerRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default customersSlice.reducer;

// Selectors ...
const CustomersSelector = (state) => state.customers;

export const getCustomers = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomersType[] => customers.rows,
);

export const getSelectedCustomer = createSelector(
  CustomersSelector,
  (customers: CustomersState): CustomersType | undefined => {
    const customerId = customers.selectedCustomer;

    return customers.rows.find((i) => (i.id === customerId));
  },
);

export const getSelectedCustomerId = createSelector(
  CustomersSelector,
  (customers: CustomersState): number | null => customers.selectedCustomer,
);

export const availableCustomers = createSelector(
  CustomersSelector,
  (customers: CustomersState): boolean => !!customers.rows.length,
);

export const isPostLoadingSelector = createSelector(
  CustomersSelector,
  (customers: CustomersState): boolean | undefined => customers.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  CustomersSelector,
  (customers: CustomersState): boolean | undefined => customers.isPutLoading,
);

// Reducer actions ...
const { setSelectedCustomer } = customersSlice.actions;
export { setSelectedCustomer };
