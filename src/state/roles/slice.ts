import {
  createAsyncThunk, createSelector, createSlice, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import {
  RoleType, readAll as readAllFn, create as createFn, update as updateFn, patch as patchFn,
} from 'services/roles';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';
import { CustomerTopMenuSelectItemType } from 'parts/menu/CustomerTopMenuSelect';

const moduleName = 'roles';
const moduleTitle = 'Role';

// Types ...
export type State = {
  rows: RoleType[] | null;
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  selectedItem: number | null;
  error: string | null | undefined;
};

const initialState: State = {
  rows: null,
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  selectedItem: null,
  error: undefined,
};

// API Actions ...
export const readAll = createAsyncThunk(`readAll${moduleName}`, async () => readAllFn());
export const create = createAsyncThunk(`create${moduleName}`, async (payload: RoleType) => createFn(payload));
export const update = createAsyncThunk(`update${moduleName}`, async (payload: RoleType) => updateFn(payload));
export const patch = createAsyncThunk(`update${moduleName}`, async (payload: RoleType) => patchFn(payload));

// Reducers ...
export const slice = createSlice({
  name: moduleName,
  initialState,
  reducers: {
    setSelectedItem: (state: Draft<State>, action: PayloadAction<string | number | null | undefined>) => {
      const selectedItem = state?.rows?.find((i) => Number(i.id) === Number(action.payload));
      state.selectedItem = selectedItem?.id ?? null;
    },
    clearSelectedItem: (state: Draft<State>) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    // Read All ...
    builder.addCase(readAll.pending, (state: Draft<State>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(readAll.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(readAll.rejected, (state, action) => {
      state.isLoading = false;
      ProgressBar.done();
    });

    // Add new item ...
    builder.addCase(create.pending, (state: Draft<State>, action) => {
      state.isPostLoading = true;
      ProgressBar.start();
    });
    builder.addCase(create.fulfilled, (state, action) => {
      toast.success(`${moduleTitle} successfully created.`);
      state.isPostLoading = false;
      ProgressBar.done();
    });
    builder.addCase(create.rejected, (state, action) => {
      state.isPostLoading = false;
      ProgressBar.done();
    });

    // Update item ...
    builder.addCase(update.pending, (state: Draft<State>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(update.fulfilled, (state, action) => {
      toast.success(`${moduleTitle} successfully updated.`);
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(update.rejected, (state, action) => {
      state.isPutLoading = false;
      ProgressBar.done();
    });
  },
});

export default slice.reducer;

// Selectors ...
const Selector = (state) => state[moduleName];

export const readAllSelector = createSelector(
  Selector,
  (state: State): RoleType[] | null => state.rows,
);

export const isLoadingSelector = createSelector(
  Selector,
  (state: State): boolean | undefined => state.isLoading,
);

export const isPostLoadingSelector = createSelector(
  Selector,
  (state: State): boolean | undefined => state.isPostLoading,
);

export const isPutLoadingSelector = createSelector(
  Selector,
  (state: State): boolean | undefined => state.isPutLoading,
);

export const errorSelector = createSelector(
  Selector,
  (state: State): string | null | undefined => state.error,
);

// Reducer actions ...
const { setSelectedItem, clearSelectedItem } = slice.actions;
export { setSelectedItem, clearSelectedItem };
