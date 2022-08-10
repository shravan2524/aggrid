import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import {
  GstinsType, fetchGstinsData, postGstinsData, putGstinsData,
} from 'services/gstinsAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';
import { CustomerTopMenuSelectItemType } from 'parts/menu/CustomerTopMenuSelect';

// Types ...
export type GstinsState = {
  rows: GstinsType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedGstin: number | null;
  error: string | null | undefined;
};

const initialState: GstinsState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedGstin: null,
  error: undefined,
};

// API Actions ...
export const fetchGstins = createAsyncThunk('getGstins', async () => fetchGstinsData());
export const newGstinRequest = createAsyncThunk('postGstins', async (data: any) => postGstinsData(data));
export const updateGstinRequest = createAsyncThunk('putGstins', async (payload: any) => putGstinsData(payload));

// Reducers ...
export const gstinsSlice = createSlice({
  name: 'gstins',
  initialState,
  reducers: {
    setSelectedGstin: (state: Draft<GstinsState>, action: PayloadAction<string | number | null | undefined>) => {
      const selectedGstin = state.rows.find((i) => Number(i.id) === Number(action.payload));
      state.selectedGstin = selectedGstin?.id ?? null;
    },
    clearGstin: (state: Draft<GstinsState>) => {
      state.selectedGstin = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Gstins ...
    builder.addCase(fetchGstins.pending, (state: Draft<GstinsState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchGstins.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchGstins.rejected, (state, action) => {
      state.isLoading = false;
      ProgressBar.done();
    });

    // Add new Gstin ...
    builder.addCase(newGstinRequest.pending, (state: Draft<GstinsState>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(newGstinRequest.fulfilled, (state, action) => {
      toast.success('Gstin successfully created.');
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(newGstinRequest.rejected, (state, action) => {
      state.isPostLoading = false;
      ProgressBar.done();
    });

    // Update Gstin ...
    builder.addCase(updateGstinRequest.pending, (state: Draft<GstinsState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateGstinRequest.fulfilled, (state, action) => {
      toast.success('Gstin successfully updated. 2');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateGstinRequest.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default gstinsSlice.reducer;

// Selectors ...
const GstinsSelector = (state) => state.gstins;

export const getGstins = createSelector(
  GstinsSelector,
  (gstins: GstinsState): GstinsType[] => gstins.rows,
);

export const selectAllGstins = createSelector(
  GstinsSelector,
  (gstins: GstinsState): CustomerTopMenuSelectItemType[] => gstins.rows.map((i) => ({ value: i.id, label: i.name })),
);

export const selectSelectedGstin = createSelector(
  GstinsSelector,
  (gstins: GstinsState): CustomerTopMenuSelectItemType | undefined => {
    const comps = gstins.rows;
    const selectedGstin = comps.find((i) => i.id === gstins.selectedGstin);
    return (gstins.selectedGstin ? ({ value: selectedGstin?.id, label: selectedGstin?.name }) : undefined);
  },
);

export const isLoadingSelector = createSelector(
  GstinsSelector,
  (gstins: GstinsState): boolean | undefined => gstins.isLoading,
);

export const isPostLoadingSelector = createSelector(
  GstinsSelector,
  (gstins: GstinsState): boolean | undefined => gstins.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  GstinsSelector,
  (gstins: GstinsState): boolean | undefined => gstins.isPutLoading,
);

export const selectErrorMessageSelector = createSelector(
  GstinsSelector,
  (gstins: GstinsState): string | null | undefined => gstins.error,
);

// Reducer actions ...
const { setSelectedGstin, clearGstin } = gstinsSlice.actions;
export { setSelectedGstin, clearGstin };
