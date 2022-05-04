import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchSomeExampleData } from 'services/exampleAPI';
import ProgressBar from 'app/utils/ProgressBar';
import { RootState } from 'state/store';

// Types ...
export interface ExampleDataState {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ExampleState {
  data: ExampleDataState[];
  status: 'idle' | 'loading' | 'failed';
}

// Reducers ...
const initialState: ExampleState = {
  data: [],
  status: 'idle',
};

// Actions ...
export const fetchExampleDataAsync = createAsyncThunk(
  'example/fetchData',
  async () => fetchSomeExampleData(1),
);

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    exampleReducer: (state, action) => {
      const userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleDataAsync.pending, (state) => {
        state.status = 'loading';
        ProgressBar.start();
      })
      .addCase(fetchExampleDataAsync.fulfilled, (state, action: PayloadAction<ExampleDataState[]>) => {
        state.status = 'idle';
        state.data = action.payload;
        ProgressBar.done();
      });
  },
});

export default exampleSlice.reducer;

export const { exampleReducer } = exampleSlice.actions;

// Selectors ...
export const selectExample = (state: RootState) => state.example.data;
