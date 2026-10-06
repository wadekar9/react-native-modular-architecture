import { useState, useCallback } from 'react';
import { permissionManager } from '../services/permission-manager';
import type { AppPermissionType, PermissionResult } from '../types/permissions.types';

export const usePermission = (type: AppPermissionType) => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<PermissionResult | null>(null);

  const request = useCallback(async (): Promise<PermissionResult> => {
    setIsRequesting(true);
    try {
      const res = await permissionManager.requestPermission(type);
      setLastResult(res);
      return res;
    } finally {
      setIsRequesting(false);
    }
  }, [type]);

  return {
    requestPermission: request,
    isRequesting,
    granted: lastResult?.granted ?? false,
    lastResult,
  };
};

