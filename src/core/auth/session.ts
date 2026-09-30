import { EStorageKeys } from '@core/storage/storage.constants';
import { Storage } from '@core/storage/storage';

export const getAccessToken = (): string | undefined =>
  Storage.getString(EStorageKeys.ACCESS_TOKEN);

export const saveAccessToken = (token: string): boolean =>
  Storage.set(EStorageKeys.ACCESS_TOKEN, token);

export const clearSession = (): boolean =>
  Storage.delete(EStorageKeys.ACCESS_TOKEN);