import { EStorageKeys } from './storage.constants';
import { SecureStorage } from './secure-storage';

export const getAccessToken = (): string | undefined =>
  SecureStorage.getItem(EStorageKeys.ACCESS_TOKEN);

export const saveAccessToken = (token: string): boolean =>
  SecureStorage.setItem(EStorageKeys.ACCESS_TOKEN, token);

export const clearSession = (): boolean =>
  SecureStorage.removeItem(EStorageKeys.ACCESS_TOKEN);

