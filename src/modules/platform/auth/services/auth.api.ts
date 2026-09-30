import { axiosInstance } from '@core/networking/axios-instance';

export type LoginCredentials = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type LoginResult = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
};

export const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
  const { data } = await axiosInstance.post<LoginResult>('/auth/login', credentials);
  return data;
};