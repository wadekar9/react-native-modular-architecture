export interface ILoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export type ILoginDto = ILoginRequest;

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

export type ILoginResponseDto = ILoginResponse;

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export type IRegisterDto = IRegisterRequest;

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  message?: string;
}

export type IRegisterResponseDto = IRegisterResponse;

export interface IForgotPasswordRequest {
  email: string;
}

export type IForgotPasswordDto = IForgotPasswordRequest;

export interface IForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export type IForgotPasswordResponseDto = IForgotPasswordResponse;

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}

export type IVerifyOtpDto = IVerifyOtpRequest;

export interface IVerifyOtpResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export type IVerifyOtpResponseDto = IVerifyOtpResponse;

export interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export type IResetPasswordDto = IResetPasswordRequest;

export interface IResetPasswordResponse {
  success: boolean;
  message: string;
}

export type IResetPasswordResponseDto = IResetPasswordResponse;

