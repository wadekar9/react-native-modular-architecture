import { configureStore } from '@reduxjs/toolkit';
import {
  authSessionReducer,
  authUserReducer,
  setSignedIn,
  setUser,
} from '../src/core/store/slices';
import {
  clearSession,
  getAccessToken,
  saveAccessToken,
} from '../src/core/storage/session.storage';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from '../src/modules/platform/auth/services/auth.api';

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

const createTestStore = () =>
  configureStore({
    reducer: {
      session: authSessionReducer,
      user: authUserReducer,
    },
  });

describe('modular auth architecture', () => {
  beforeEach(() => {
    clearSession();
    jest.clearAllMocks();
  });

  describe('session & user core store', () => {
    it('manages persistent session state without redux request pollution', () => {
      const store = createTestStore();

      expect(store.getState().session.isSignedIn).toBe(false);
      expect(store.getState().user.user).toBeNull();
      // Ensure transient request state is not part of the core store
      expect((store.getState() as Record<string, unknown>).authRequest).toBeUndefined();

      store.dispatch(
        setUser({
          id: '1',
          email: 'emilys@example.com',
          firstName: 'Emily',
          lastName: 'Smith',
        }),
      );
      store.dispatch(setSignedIn(true));

      expect(store.getState().session.isSignedIn).toBe(true);
      expect(store.getState().user.user).toEqual({
        id: '1',
        email: 'emilys@example.com',
        firstName: 'Emily',
        lastName: 'Smith',
      });
    });

    it('persists and clears auth session tokens in secure storage', () => {
      expect(getAccessToken()).toBeUndefined();

      saveAccessToken('test-access-token-xyz');
      expect(getAccessToken()).toBe('test-access-token-xyz');

      clearSession();
      expect(getAccessToken()).toBeUndefined();
    });
  });

  describe('auth services API integration', () => {
    it('handles sign in API success and failure', async () => {
      mockedLogin.mockResolvedValueOnce({
        id: 7,
        username: 'emilys',
        email: 'emilys@example.com',
        firstName: 'Emily',
        lastName: 'Smith',
        gender: 'female',
        image: 'https://example.com/avatar.png',
        token: 'access-token-123',
      });

      const response = await login({ username: 'emilys', password: 'password' });
      expect(response.token).toBe('access-token-123');
      expect(response.username).toBe('emilys');

      mockedLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
      await expect(login({ username: 'emilys', password: 'wrong' })).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('handles register API success and failure', async () => {
      mockedRegister.mockResolvedValueOnce({
        id: 99,
        username: 'newuser',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      });

      const response = await register({
        username: 'newuser',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      });
      expect(response.id).toBe(99);
      expect(response.username).toBe('newuser');

      mockedRegister.mockRejectedValueOnce(new Error('Email already registered'));
      await expect(
        register({
          username: 'newuser',
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          password: 'password123',
        }),
      ).rejects.toThrow('Email already registered');
    });

    it('handles forgot password API success and failure', async () => {
      mockedForgotPassword.mockResolvedValueOnce({
        success: true,
        message: 'OTP sent successfully',
      });

      const response = await forgotPassword({ email: 'user@example.com' });
      expect(response.message).toBe('OTP sent successfully');

      mockedForgotPassword.mockRejectedValueOnce(new Error('User not found'));
      await expect(forgotPassword({ email: 'unknown@example.com' })).rejects.toThrow(
        'User not found',
      );
    });

    it('handles verify OTP API success and failure', async () => {
      mockedVerifyOtp.mockResolvedValueOnce({
        success: true,
        message: 'OTP verified',
      });

      const response = await verifyOtp({ email: 'user@example.com', otp: '123456' });
      expect(response.success).toBe(true);

      mockedVerifyOtp.mockRejectedValueOnce(new Error('Invalid OTP'));
      await expect(verifyOtp({ email: 'user@example.com', otp: '000000' })).rejects.toThrow(
        'Invalid OTP',
      );
    });

    it('handles reset password API success and failure', async () => {
      mockedResetPassword.mockResolvedValueOnce({
        success: true,
        message: 'Password reset successful',
      });

      const response = await resetPassword({
        email: 'user@example.com',
        otp: '123456',
        newPassword: 'newpassword123',
      });
      expect(response.success).toBe(true);

      mockedResetPassword.mockRejectedValueOnce(new Error('Reset token expired'));
      await expect(
        resetPassword({
          email: 'user@example.com',
          otp: '123456',
          newPassword: 'newpassword123',
        }),
      ).rejects.toThrow('Reset token expired');
    });
  });
});