import {
  createAsyncThunk, createSelector, createSlice, Draft,
} from '@reduxjs/toolkit';
import { postComments, fetchCommentsData, CommentType } from 'services/commentsAPIServices';
import ProgressBar from 'app/utils/ProgressBar';
import { toast } from 'react-hot-toast';

// Types ...
export type CommentsState = {
  rows: CommentType[];
  isLoading: boolean;
  isPostLoading: boolean;
  isPutLoading: boolean;
  error: string | null | undefined;
};

const initialState: CommentsState = {
  rows: [],
  isLoading: false,
  isPostLoading: false,
  isPutLoading: false,
  error: undefined,
};

// API Actions ...
export const fetchComments = createAsyncThunk('getComments', async () => fetchCommentsData());
export const postComment = createAsyncThunk('postComments', async (payload: any) => postComments(payload));

// Reducers ...
export const CommentsSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Fetch Comments ...
    builder.addCase(fetchComments.pending, (state: Draft<CommentsState>, action) => {
      state.isLoading = true;
      ProgressBar.start();
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.rows = action.payload;
      state.isLoading = false;
      ProgressBar.done();
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      ProgressBar.done();
    });

    // Set ContentType
    builder.addCase(postComment.pending, (state: Draft<CommentsState>, action) => {
      state.isPutLoading = true;
      ProgressBar.start();
    });
    builder.addCase(postComment.fulfilled, (state, action) => {
      toast.success('File successfully updated.');
      state.isPutLoading = false;
      ProgressBar.done();
    });
    builder.addCase(postComment.rejected, (state, action) => {
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
  (Comments: CommentsState): CommentType[] => Comments.rows,
);

export const isLoadingSelector = createSelector(
  CommentsSelector,
  (Comments: CommentsState): boolean | undefined => Comments.isLoading,
);

export const isPutLoadingSelector = createSelector(
  CommentsSelector,
  (Comments: CommentsState): boolean | undefined => Comments.isPutLoading,
);

export const selectErrorMessageSelector = createSelector(
  CommentsSelector,
  (Comments: CommentsState): string | null | undefined => Comments.error,
);
