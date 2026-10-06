import { axiosInstance } from '@core/networking/axios-instance';
import { API_ROUTES } from '@shared/constants';
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
  const { data } = await axiosInstance.post<ILoginResponse>(API_ROUTES.AUTH.LOGIN, credentials);
  return data;
};

export const register = async (payload: IRegisterRequest): Promise<IRegisterResponse> => {
  const { data } = await axiosInstance.post<IRegisterResponse>(API_ROUTES.AUTH.REGISTER, {
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
    API_ROUTES.AUTH.FORGOT_PASSWORD,
    payload,
  );
  return data;
};

export const verifyOtp = async (
  payload: IVerifyOtpRequest,
): Promise<IVerifyOtpResponse> => {
  const { data } = await axiosInstance.post<IVerifyOtpResponse>(
    API_ROUTES.AUTH.VERIFY_OTP,
    payload,
  );
  return data;
};

export const resetPassword = async (
  payload: IResetPasswordRequest,
): Promise<IResetPasswordResponse> => {
  const { data } = await axiosInstance.post<IResetPasswordResponse>(
    API_ROUTES.AUTH.RESET_PASSWORD,
    payload,
  );
  return data;
};