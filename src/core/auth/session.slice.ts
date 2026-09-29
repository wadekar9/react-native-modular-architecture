import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAccessToken } from './session';

type AuthSessionState = {
  isSignedIn: boolean;
};

const initialState: AuthSessionState = {
  isSignedIn: Boolean(getAccessToken()),
};

const authSessionSlice = createSlice({
  name: 'authSession',
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
  },
});

export const { setSignedIn } = authSessionSlice.actions;
export const authSessionReducer = authSessionSlice.reducer;