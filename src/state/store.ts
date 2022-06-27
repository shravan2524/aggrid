import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from 'state/settings/settingsSlice';
import companiesReducer from 'state/companies/companiesSlice';
import tenants from 'state/tenants/tenantsSlice';
import filesReducer from 'state/files/filesSlice';
import roles from 'state/roles/slice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    companies: companiesReducer,
    tenants,
    files: filesReducer,
    roles,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
