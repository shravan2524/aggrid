import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from 'state/settings/settingsSlice';
import companiesReducer from 'state/companies/companiesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    companies: companiesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
