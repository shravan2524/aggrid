import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import settingsReducer from 'state/settings/settingsSlice';
import GgReducer from 'state/gstins/gstinsSlice';
import tenants from 'state/tenants/tenantsSlice';
import filesReducer from 'state/files/filesSlice';
import roles from 'state/roles/slice';
import users from 'state/users/slice';
import pans from 'state/pans/pansSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    gstins: GgReducer,
    tenants,
    files: filesReducer,
    roles,
    users,
    pans,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
