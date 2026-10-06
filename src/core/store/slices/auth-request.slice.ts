import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

type AuthRequestState = {
  signInStatus: RequestStatus;
  signInError: string | null;
  registerStatus: RequestStatus;
  registerError: string | null;
  forgotPasswordStatus: RequestStatus;
  forgotPasswordError: string | null;
  otpStatus: RequestStatus;
  otpError: string | null;
  resetPasswordStatus: RequestStatus;
  resetPasswordError: string | null;
};

const initialState: AuthRequestState = {
  signInStatus: 'idle',
  signInError: null,
  registerStatus: 'idle',
  registerError: null,
  forgotPasswordStatus: 'idle',
  forgotPasswordError: null,
  otpStatus: 'idle',
  otpError: null,
  resetPasswordStatus: 'idle',
  resetPasswordError: null,
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
    resetSignInState: state => {
      state.signInStatus = 'idle';
      state.signInError = null;
    },

    registerStarted: state => {
      state.registerStatus = 'pending';
      state.registerError = null;
    },
    registerSucceeded: state => {
      state.registerStatus = 'succeeded';
    },
    registerFailed: (state, action: PayloadAction<string>) => {
      state.registerStatus = 'failed';
      state.registerError = action.payload;
    },
    resetRegisterState: state => {
      state.registerStatus = 'idle';
      state.registerError = null;
    },

    forgotPasswordStarted: state => {
      state.forgotPasswordStatus = 'pending';
      state.forgotPasswordError = null;
    },
    forgotPasswordSucceeded: state => {
      state.forgotPasswordStatus = 'succeeded';
    },
    forgotPasswordFailed: (state, action: PayloadAction<string>) => {
      state.forgotPasswordStatus = 'failed';
      state.forgotPasswordError = action.payload;
    },
    resetForgotPasswordState: state => {
      state.forgotPasswordStatus = 'idle';
      state.forgotPasswordError = null;
    },

    otpStarted: state => {
      state.otpStatus = 'pending';
      state.otpError = null;
    },
    otpSucceeded: state => {
      state.otpStatus = 'succeeded';
    },
    otpFailed: (state, action: PayloadAction<string>) => {
      state.otpStatus = 'failed';
      state.otpError = action.payload;
    },
    resetOtpState: state => {
      state.otpStatus = 'idle';
      state.otpError = null;
    },

    resetPasswordStarted: state => {
      state.resetPasswordStatus = 'pending';
      state.resetPasswordError = null;
    },
    resetPasswordSucceeded: state => {
      state.resetPasswordStatus = 'succeeded';
    },
    resetPasswordFailed: (state, action: PayloadAction<string>) => {
      state.resetPasswordStatus = 'failed';
      state.resetPasswordError = action.payload;
    },
    resetResetPasswordState: state => {
      state.resetPasswordStatus = 'idle';
      state.resetPasswordError = null;
    },
  },
});

export const {
  signInFailed,
  signInStarted,
  signInSucceeded,
  resetSignInState,
  registerStarted,
  registerSucceeded,
  registerFailed,
  resetRegisterState,
  forgotPasswordStarted,
  forgotPasswordSucceeded,
  forgotPasswordFailed,
  resetForgotPasswordState,
  otpStarted,
  otpSucceeded,
  otpFailed,
  resetOtpState,
  resetPasswordStarted,
  resetPasswordSucceeded,
  resetPasswordFailed,
  resetResetPasswordState,
} = authRequestSlice.actions;

export const authRequestReducer = authRequestSlice.reducer;
