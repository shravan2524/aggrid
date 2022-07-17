import {
  createAsyncThunk, createSelector, createSlice, Draft,
} from '@reduxjs/toolkit';
import { postColumnGroup, fetchColumnGroup, ColumnGroupType } from 'services/columnGroupsAPIServices';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

export type ColumnGroupState = {
	rows: ColumnGroupType[];
	isLoading: boolean;
	isPostLoading: boolean;
	isPutLoading: boolean;
	error: string | null | undefined;
  };

  const initialState: ColumnGroupState = {
	rows: [],
	isLoading: false,
	isPostLoading: false,
	isPutLoading: false,
	error: undefined,
  };

export const fetchColumn = createAsyncThunk('getComments', async () => fetchColumnGroup());
export const postColumns = createAsyncThunk('postColumnss', async (payload: any) => postColumnGroup(payload));

// Reducers ...
export const CommentsSlice = createSlice({
	name: 'comment',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
	  // Fetch Comments ...
	  builder.addCase(fetchColumn.pending, (state: Draft<ColumnGroupState>, action) => {
		state.isLoading = true;
		ProgressBar.start();
	  });
	  builder.addCase(fetchColumn.fulfilled, (state, action) => {
		state.rows = action.payload;
		state.isLoading = false;
		ProgressBar.done();
	  });
	  builder.addCase(fetchColumn.rejected, (state, action) => {
		state.isLoading = false;
		ProgressBar.done();
	  });

	  // Set ContentType
	  builder.addCase(postColumns.pending, (state: Draft<ColumnGroupState>, action) => {
		state.isPutLoading = true;
		ProgressBar.start();
	  });
	  builder.addCase(postColumns.fulfilled, (state, action) => {
		toast.success('File successfully updated.');
		state.isPutLoading = false;
		ProgressBar.done();
	  });
	  builder.addCase(postColumns.rejected, (state, action) => {
		state.isPutLoading = false;
		ProgressBar.done();
	  });
	},
  });

  export default CommentsSlice.reducer;
  // Selectors ...
  const CommentsSelector = (state) => state.Comments;

  export const getComments = createSelector(
	CommentsSelector,
	(Comments: ColumnGroupState): ColumnGroupType[] => Comments.rows,
  );

  export const isLoadingSelector = createSelector(
	CommentsSelector,
	(Comments: ColumnGroupState): boolean | undefined => Comments.isLoading,
  );

  export const isPutLoadingSelector = createSelector(
	CommentsSelector,
	(Comments: ColumnGroupState): boolean | undefined => Comments.isPutLoading,
  );

  export const selectErrorMessageSelector = createSelector(
	CommentsSelector,
	(Comments: ColumnGroupState): string | null | undefined => Comments.error,
  );
