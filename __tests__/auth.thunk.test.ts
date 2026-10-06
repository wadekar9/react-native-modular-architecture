import { configureStore } from '@reduxjs/toolkit';
import {
  authRequestReducer,
  authSessionReducer,
  authUserReducer,
} from '../src/core/store/slices';
import { clearSession, getAccessToken } from '../src/core/storage/session.storage';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from '../src/modules/platform/auth/services/auth.api';
import {
  forgotPasswordThunk,
  registerThunk,
  resetPasswordThunk,
  signInThunk,
  verifyOtpThunk,
} from '../src/modules/platform/auth/auth.thunks';

jest.mock('../src/modules/platform/auth/services/auth.api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  forgotPassword: jest.fn(),
  verifyOtp: jest.fn(),
  resetPassword: jest.fn(),
}));

const mockedLogin = jest.mocked(login);
const mockedRegister = jest.mocked(register);
const mockedForgotPassword = jest.mocked(forgotPassword);
const mockedVerifyOtp = jest.mocked(verifyOtp);
const mockedResetPassword = jest.mocked(resetPassword);

const createTestStore = () => configureStore({
  reducer: {
    authRequest: authRequestReducer,
    session: authSessionReducer,
    user: authUserReducer,
  },
});

describe('auth thunks', () => {
  beforeEach(() => {
    clearSession();
    jest.clearAllMocks();
  });

  describe('sign-in thunk', () => {
    it('stores the session and updates auth state when sign-in succeeds', async () => {
      mockedLogin.mockResolvedValue({
        id: 7,
        username: 'demo',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        gender: 'other',
        image: 'https://example.com/avatar.png',
        token: 'access-token',
      });
      const store = createTestStore();

      await store.dispatch(signInThunk({ username: 'demo', password: 'password' }));

      expect(getAccessToken()).toBe('access-token');
      expect(store.getState().session.isSignedIn).toBe(true);
      expect(store.getState().user.user).toMatchObject({
        id: '7',
        email: 'demo@example.com',
        firstName: 'Demo',
      });
      expect(store.getState().authRequest).toMatchObject({
        signInStatus: 'succeeded',
        signInError: null,
      });
    });

    it('exposes request errors and leaves the session signed out when sign-in fails', async () => {
      mockedLogin.mockRejectedValue(new Error('Invalid credentials'));
      const store = createTestStore();

      const action = await store.dispatch(signInThunk({ username: 'demo', password: 'wrong' }));

      expect(signInThunk.rejected.match(action)).toBe(true);
      expect(store.getState().session.isSignedIn).toBe(false);
      expect(store.getState().authRequest).toMatchObject({
        signInStatus: 'failed',
        signInError: 'Invalid credentials',
      });
    });
  });

  describe('register thunk', () => {
    it('updates register state when registration succeeds', async () => {
      mockedRegister.mockResolvedValue({
        id: 99,
        username: 'newuser',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      });
      const store = createTestStore();

      const action = await store.dispatch(registerThunk({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      }));

      expect(registerThunk.fulfilled.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        registerStatus: 'succeeded',
        registerError: null,
      });
    });

    it('handles registration failure', async () => {
      mockedRegister.mockRejectedValue(new Error('Username already exists'));
      const store = createTestStore();

      const action = await store.dispatch(registerThunk({
        username: 'existing',
        email: 'existing@example.com',
        password: 'password123',
      }));

      expect(registerThunk.rejected.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        registerStatus: 'failed',
        registerError: 'Username already exists',
      });
    });
  });

  describe('forgot password thunk', () => {
    it('updates forgot password state when request succeeds', async () => {
      mockedForgotPassword.mockResolvedValue({
        success: true,
        message: 'OTP sent',
        otp: '123456',
      });
      const store = createTestStore();

      const action = await store.dispatch(forgotPasswordThunk({ email: 'test@example.com' }));

      expect(forgotPasswordThunk.fulfilled.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        forgotPasswordStatus: 'succeeded',
        forgotPasswordError: null,
      });
    });

    it('handles forgot password failure', async () => {
      mockedForgotPassword.mockRejectedValue(new Error('Email not found'));
      const store = createTestStore();

      const action = await store.dispatch(forgotPasswordThunk({ email: 'unknown@example.com' }));

      expect(forgotPasswordThunk.rejected.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        forgotPasswordStatus: 'failed',
        forgotPasswordError: 'Email not found',
      });
    });
  });

  describe('verify otp thunk', () => {
    it('updates otp state when verification succeeds', async () => {
      mockedVerifyOtp.mockResolvedValue({
        success: true,
        message: 'Verified',
        resetToken: 'token-abc',
      });
      const store = createTestStore();

      const action = await store.dispatch(verifyOtpThunk({ email: 'test@example.com', otp: '123456' }));

      expect(verifyOtpThunk.fulfilled.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        otpStatus: 'succeeded',
        otpError: null,
      });
    });

    it('handles invalid otp failure', async () => {
      mockedVerifyOtp.mockRejectedValue(new Error('Invalid OTP'));
      const store = createTestStore();

      const action = await store.dispatch(verifyOtpThunk({ email: 'test@example.com', otp: '000000' }));

      expect(verifyOtpThunk.rejected.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        otpStatus: 'failed',
        otpError: 'Invalid OTP',
      });
    });
  });

  describe('reset password thunk', () => {
    it('updates reset password state when password reset succeeds', async () => {
      mockedResetPassword.mockResolvedValue({
        success: true,
        message: 'Password reset',
      });
      const store = createTestStore();

      const action = await store.dispatch(resetPasswordThunk({
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPassword123',
      }));

      expect(resetPasswordThunk.fulfilled.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        resetPasswordStatus: 'succeeded',
        resetPasswordError: null,
      });
    });

    it('handles reset password failure', async () => {
      mockedResetPassword.mockRejectedValue(new Error('Reset token expired'));
      const store = createTestStore();

      const action = await store.dispatch(resetPasswordThunk({
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPassword123',
      }));

      expect(resetPasswordThunk.rejected.match(action)).toBe(true);
      expect(store.getState().authRequest).toMatchObject({
        resetPasswordStatus: 'failed',
        resetPasswordError: 'Reset token expired',
      });
    });
  });
});