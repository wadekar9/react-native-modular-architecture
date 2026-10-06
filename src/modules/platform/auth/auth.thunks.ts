import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveAccessToken } from '@core/storage/session.storage';
import {
  forgotPasswordFailed,
  forgotPasswordStarted,
  forgotPasswordSucceeded,
  otpFailed,
  otpStarted,
  otpSucceeded,
  registerFailed,
  registerStarted,
  registerSucceeded,
  resetPasswordFailed,
  resetPasswordStarted,
  resetPasswordSucceeded,
  setSignedIn,
  setUser,
  signInFailed,
  signInStarted,
  signInSucceeded,
} from '@core/store/slices';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from './services';
import {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  ILoginRequest,
  IRegisterRequest,
  IRegisterResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IVerifyOtpRequest,
  IVerifyOtpResponse,
} from './types/auth.types';

export const signInThunk = createAsyncThunk<
  void,
  ILoginRequest,
  { rejectValue: string }
>(
  'platformAuth/signIn',
  async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(signInStarted());

    try {
      const result = await login({ ...credentials, expiresInMins: 60 });
      const token = result.token || result.accessToken;

      if (!token) {
        throw new Error('Authentication token missing from response.');
      }

      const saved = saveAccessToken(token);

      if (!saved) {
        throw new Error('Unable to save your session. Please try again.');
      }

      dispatch(setUser({
        id: String(result.id),
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        avatar: result.image,
      }));
      dispatch(setSignedIn(true));
      dispatch(signInSucceeded());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
      dispatch(signInFailed(message));
      return rejectWithValue(message);
    }
  },
);

export const registerThunk = createAsyncThunk<
  IRegisterResponse,
  IRegisterRequest,
  { rejectValue: string }
>(
  'platformAuth/register',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(registerStarted());

    try {
      const result = await register(payload);
      dispatch(registerSucceeded());
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to register. Please try again.';
      dispatch(registerFailed(message));
      return rejectWithValue(message);
    }
  },
);

export const forgotPasswordThunk = createAsyncThunk<
  IForgotPasswordResponse,
  IForgotPasswordRequest,
  { rejectValue: string }
>(
  'platformAuth/forgotPassword',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(forgotPasswordStarted());

    try {
      const result = await forgotPassword(payload);
      dispatch(forgotPasswordSucceeded());
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to send OTP. Please try again.';
      dispatch(forgotPasswordFailed(message));
      return rejectWithValue(message);
    }
  },
);

export const verifyOtpThunk = createAsyncThunk<
  IVerifyOtpResponse,
  IVerifyOtpRequest,
  { rejectValue: string }
>(
  'platformAuth/verifyOtp',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(otpStarted());

    try {
      const result = await verifyOtp(payload);
      dispatch(otpSucceeded());
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      dispatch(otpFailed(message));
      return rejectWithValue(message);
    }
  },
);

export const resetPasswordThunk = createAsyncThunk<
  IResetPasswordResponse,
  IResetPasswordRequest,
  { rejectValue: string }
>(
  'platformAuth/resetPassword',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(resetPasswordStarted());

    try {
      const result = await resetPassword(payload);
      dispatch(resetPasswordSucceeded());
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to reset password. Please try again.';
      dispatch(resetPasswordFailed(message));
      return rejectWithValue(message);
    }
  },
);