import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import {
  FilesType, fetchFilesData, putFilesData,
} from 'services/filesAPIService';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';
import { CustomerTopMenuSelectItemType } from 'parts/menu/CustomerTopMenuSelect';

// Types ...
export type FilesState = {
  rows: FilesType[];
  isLoading: boolean; isPostLoading: boolean;
  isPutLoading: boolean;
  error: string | null | undefined;
};

const initialState: FilesState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  error: undefined,
};

// API Actions ...
export const fetchFiles = createAsyncThunk('getFiles', async () => fetchFilesData());
export const updateFileRequest = createAsyncThunk('putFiles', async (payload: any) => putFilesData(payload));

// Reducers ...
export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    // Fetch Files ...
    builder.addCase(fetchFiles.pending, (state: Draft<FilesState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchFiles.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchFiles.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isLoading = false;
      ProgressBar.done();
    });

    // Update File ...
    builder.addCase(updateFileRequest.pending, (state: Draft<FilesState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(updateFileRequest.fulfilled, (state, action) => {
      toast.success('File successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(updateFileRequest.rejected, (state, action) => {
      const error = action.error.message;
      if (error) {
        toast.error(error);
      }
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default filesSlice.reducer;

// Selectors ...
const FilesSelector = (state) => state.files;

export const getFiles = createSelector(
  FilesSelector,
  (Files: FilesState): FilesType[] => Files.rows,
);

export const isLoadingSelector = createSelector(
  FilesSelector,
  (Files: FilesState): boolean | undefined => Files.isLoading,
);

export const isPutLoadingSelector = createSelector(
  FilesSelector,
  (Files: FilesState): boolean | undefined => Files.isPutLoading,
);

export const selectErrorMessageSelector = createSelector(
  FilesSelector,
  (Files: FilesState): string | null | undefined => Files.error,
);
