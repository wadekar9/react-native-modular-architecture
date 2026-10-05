import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveAccessToken } from '@core/storage/session.storage';
import {
  setSignedIn,
  setUser,
  signInFailed,
  signInStarted,
  signInSucceeded,
} from '@core/store/slices';
import { login } from './services/auth.api';

type SignInCredentials = {
  username: string;
  password: string;
};

export const signInThunk = createAsyncThunk<
  void,
  SignInCredentials,
  { rejectValue: string }
>(
  'platformAuth/signIn',
  async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(signInStarted());

    try {
      const result = await login({ ...credentials, expiresInMins: 60 });
      const saved = saveAccessToken(result.token);

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