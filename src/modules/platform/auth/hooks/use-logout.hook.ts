import { useCallback } from 'react';
import { logout } from '../services';

export const useLogout = () => {
  return useCallback(() => {
    logout();
  }, []);
};
