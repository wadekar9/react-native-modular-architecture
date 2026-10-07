import { axiosInstance } from '@core/networking/axios-instance';
import { AUTH_API_ROUTES } from './auth.routes'
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

export const login = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
  const { data } = await axiosInstance.post<ILoginResponse>(AUTH_API_ROUTES.LOGIN, credentials);
  return data;
};

export const register = async (payload: IRegisterRequest): Promise<IRegisterResponse> => {
  const { data } = await axiosInstance.post<IRegisterResponse>(AUTH_API_ROUTES.REGISTER, {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    firstName: payload.firstName || payload.username,
    lastName: payload.lastName || '',
    phone: payload.phone,
  });
  return data;
};

export const forgotPassword = async (
  payload: IForgotPasswordRequest,
): Promise<IForgotPasswordResponse> => {
  const { data } = await axiosInstance.post<IForgotPasswordResponse>(
    AUTH_API_ROUTES.FORGOT_PASSWORD,
    payload,
  );
  return data;
};

export const verifyOtp = async (
  payload: IVerifyOtpRequest,
): Promise<IVerifyOtpResponse> => {
  const { data } = await axiosInstance.post<IVerifyOtpResponse>(
    AUTH_API_ROUTES.VERIFY_OTP,
    payload,
  );
  return data;
};

export const resetPassword = async (
  payload: IResetPasswordRequest,
): Promise<IResetPasswordResponse> => {
  const { data } = await axiosInstance.post<IResetPasswordResponse>(
    AUTH_API_ROUTES.RESET_PASSWORD,
    payload,
  );
  return data;
};