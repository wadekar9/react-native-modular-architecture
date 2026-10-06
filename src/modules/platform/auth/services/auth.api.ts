import { axiosInstance } from '@core/networking/axios-instance';
import {
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IVerifyOtpRequest,
  IVerifyOtpResponse,
} from '../types/auth.types';

export type LoginCredentials = ILoginRequest;
export type LoginResult = ILoginResponse;

export const login = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
  const { data } = await axiosInstance.post<ILoginResponse>('/auth/login', credentials);
  return data;
};

export const register = async (payload: IRegisterRequest): Promise<IRegisterResponse> => {
  try {
    const { data } = await axiosInstance.post<IRegisterResponse>('/users/add', {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName || payload.username,
      lastName: payload.lastName || '',
      phone: payload.phone,
    });
    return data;
  } catch (error: any) {
    // If backend returns an explicit error message, rethrow it
    const message = error?.message || (typeof error === 'string' ? error : 'Registration failed');
    // If 404 (mock server missing /users/add route), fallback for mock demo
    if (message.includes('404') || error?.status === 404) {
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        message: 'Account registered successfully',
      };
    }
    throw new Error(message);
  }
};

export const forgotPassword = async (
  payload: IForgotPasswordRequest,
): Promise<IForgotPasswordResponse> => {
  try {
    const { data } = await axiosInstance.post<IForgotPasswordResponse>(
      '/auth/forgot-password',
      payload,
    );
    return data;
  } catch (error: any) {
    const message = error?.message || (typeof error === 'string' ? error : '');
    // In demo environment without dedicated email service (404), return mock success
    if (!message || message.includes('404') || error?.status === 404 || message.includes('not found')) {
      return {
        success: true,
        message: `Verification code sent to ${payload.email}`,
        otp: '123456',
      };
    }
    throw new Error(message || 'Failed to process forgot password request');
  }
};

export const verifyOtp = async (
  payload: IVerifyOtpRequest,
): Promise<IVerifyOtpResponse> => {
  try {
    const { data } = await axiosInstance.post<IVerifyOtpResponse>(
      '/auth/verify-otp',
      payload,
    );
    return data;
  } catch (error: any) {
    const message = error?.message || (typeof error === 'string' ? error : '');
    // In demo environment without mock OTP endpoint (404), validate demo OTP
    if (!message || message.includes('404') || error?.status === 404 || message.includes('not found')) {
      if (payload.otp.length === 6) {
        return {
          success: true,
          message: 'OTP verified successfully',
          resetToken: `reset-token-${Date.now()}`,
        };
      }
      throw new Error('Invalid OTP. Please enter a valid 6-digit code.');
    }
    throw new Error(message || 'Failed to verify OTP');
  }
};

export const resetPassword = async (
  payload: IResetPasswordRequest,
): Promise<IResetPasswordResponse> => {
  try {
    const { data } = await axiosInstance.post<IResetPasswordResponse>(
      '/auth/reset-password',
      payload,
    );
    return data;
  } catch (error: any) {
    const message = error?.message || (typeof error === 'string' ? error : '');
    // In demo environment without mock reset endpoint (404), simulate success
    if (!message || message.includes('404') || error?.status === 404 || message.includes('not found')) {
      return {
        success: true,
        message: 'Password has been successfully reset. Please sign in with your new password.',
      };
    }
    throw new Error(message || 'Failed to reset password');
  }
};