export type { IAuthUser } from '@shared/types/user.types';

export interface ILoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface ILoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  message?: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface IVerifyOtpResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IResetPasswordResponse {
  success: boolean;
  message: string;
}
