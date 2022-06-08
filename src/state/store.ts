import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from 'state/settings/settingsSlice';
import companiesReducer from 'state/companies/companiesSlice';
import customersReducer from 'state/customers/customersSlice';
import filesReducer from 'state/files/filesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    companies: companiesReducer,
    customers: customersReducer,
    files: filesReducer,
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
