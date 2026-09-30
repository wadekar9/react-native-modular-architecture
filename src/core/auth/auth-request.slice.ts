import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthRequestState = {
  signInStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  signInError: string | null;
};

const initialState: AuthRequestState = {
  signInStatus: 'idle',
  signInError: null,
};

const authRequestSlice = createSlice({
  name: 'authRequest',
  initialState,
  reducers: {
    signInStarted: state => {
      state.signInStatus = 'pending';
      state.signInError = null;
    },
    signInSucceeded: state => {
      state.signInStatus = 'succeeded';
    },
    signInFailed: (state, action: PayloadAction<string>) => {
      state.signInStatus = 'failed';
      state.signInError = action.payload;
    },
  },
});

export const { signInFailed, signInStarted, signInSucceeded } = authRequestSlice.actions;
export const authRequestReducer = authRequestSlice.reducer;