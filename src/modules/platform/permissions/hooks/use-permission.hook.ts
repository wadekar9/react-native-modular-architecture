import { useState, useCallback } from 'react';
import { permissionManager } from '../services/permission-manager';
import type { AppPermissionType, PermissionResult } from '../types/permissions.types';

export const usePermission = (type: AppPermissionType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PermissionResult | null>(null);

  const request = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await permissionManager.requestPermission(type);
      setResult(res);
      return res.granted;
    } finally {
      setLoading(false);
    }
  }, [type]);

  return {
    request,
    isGranted: result?.granted ?? false,
    loading,
    error: result?.error,
  };
};

