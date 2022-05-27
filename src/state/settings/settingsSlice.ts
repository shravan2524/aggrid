import { createSlice } from '@reduxjs/toolkit';

import { RootState } from 'state/store';

export interface SecondaryMenuItemType {
  path: string;
  text: string;
  icon?: string;
}

export interface SettingsState {
  secondaryMenuItems: SecondaryMenuItemType[],
}

// Reducers ...
const initialState: SettingsState = {
  secondaryMenuItems: [],
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSecondaryMenuItems: (state, action) => {
      state.secondaryMenuItems = action.payload;
    },
  },
});

export default settingsSlice.reducer;

export const { setSecondaryMenuItems } = settingsSlice.actions;

// Selectors ...
export const selectSecondaryMenuItems = (state: RootState):SecondaryMenuItemType[] => state.settings.secondaryMenuItems;
export const isSecondaryMenuItemVisible = (state: RootState):boolean => (!!state.settings.secondaryMenuItems.length);
