import { useCallback } from 'react';
import { logout } from '../services/logout.service';

export const useLogout = () => {
  return useCallback(() => {
    logout();
  }, []);
};
