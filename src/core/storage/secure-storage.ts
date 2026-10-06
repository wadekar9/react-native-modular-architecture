import { createMMKV } from 'react-native-mmkv';
import { EStorageKeys } from './storage.constants';

const secureInstance = createMMKV({
  id: 'superapp.secure_storage',
  encryptionKey: 'superapp-secure-vault-key',
});

/**
 * Two-tier storage adapter providing encrypted storage for sensitive data (auth tokens, keys).
 * Complements standard MMKV cache storage.
 */
export const SecureStorage = {
  setItem(key: EStorageKeys | string, value: string): boolean {
    try {
      secureInstance.set(key, value);
      return true;
    } catch {
      return false;
    }
  },

  getItem(key: EStorageKeys | string): string | undefined {
    try {
      return secureInstance.getString(key);
    } catch {
      return undefined;
    }
  },

  removeItem(key: EStorageKeys | string): boolean {
    try {
      secureInstance.remove(key);
      return true;
    } catch {
      return false;
    }
  },

  clearAll(): void {
    try {
      secureInstance.clearAll();
    } catch {}
  },
};

