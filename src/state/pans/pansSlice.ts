import {
  createAsyncThunk, createSelector, createSlice, Draft,
} from '@reduxjs/toolkit';
import {
  PanType, fetchPansData, postPansData, putPansData,
} from 'services/pansAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';
import { GstinsState } from '../gstins/gstinsSlice';

// Types ...
type PansState = {
  rows: PanType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedPanUuid: string | null;
  error: string | null | undefined;
};

const initialState: PansState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedPanUuid: null,
  error: undefined,
};

// API Actions ...
export const fetchPans = createAsyncThunk('fetchPans', async () => fetchPansData());
export const newPanRequest = createAsyncThunk('postPans', async (data: any) => postPansData(data));
export const updatePanRequest = createAsyncThunk('putPansData', async (payload: any) => putPansData(payload));

// Reducers ...
export const PansSlice = createSlice({
  name: 'pans',
  initialState,
  reducers: {
  },

  extraReducers(builder) {
    // Fetching Pans ...
    builder.addCase(fetchPans.pending, (state: Draft<PansState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchPans.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchPans.rejected, (state, action) => {
      state.isLoading = false;
      ProgressBar.done();
    });

    // Adding new Pan ...
    builder.addCase(newPanRequest.pending, (state: Draft<PansState>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(newPanRequest.fulfilled, (state, action) => {
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(newPanRequest.rejected, (state, action) => {
      state.isPostLoading = false;
      ProgressBar.done();
    });

    // Update Pan ...
    builder.addCase(updatePanRequest.pending, (state: Draft<PansState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updatePanRequest.fulfilled, (state, action) => {
      toast.success('Pans successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updatePanRequest.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default PansSlice.reducer;

// Selectors ...
const PansSelector = (state) => state.pans;

export const getPans = createSelector(
  PansSelector,
  (Pans: PansState): PanType[] => Pans.rows,
);

export const isLoadingSelector = createSelector(
    PansSelector,
    (Pans: GstinsState): boolean | undefined => Pans.isLoading,
);

export const isPostLoadingSelector = createSelector(
  PansSelector,
  (Pans: PansState): boolean | undefined => Pans.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  PansSelector,
  (Pans: PansState): boolean | undefined => Pans.isPutLoading,
);
