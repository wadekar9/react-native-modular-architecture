import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModuleFlags = Record<string, boolean | undefined>;

const flagsSlice = createSlice({
  name: 'flags',
  initialState: {} as ModuleFlags,
  reducers: {
    setFlags: (_state, action: PayloadAction<ModuleFlags>) => action.payload,
  },
});

export const { setFlags } = flagsSlice.actions;
export const flagsReducer = flagsSlice.reducer;