import { useCallback, useEffect, useState } from 'react';
import { offlineSync } from '../offline-sync.service';
import type { OfflineSyncStatusEvent, SyncResult } from '../types';

export interface UseOfflineSyncStatusResult extends OfflineSyncStatusEvent {
  syncNow: () => Promise<SyncResult>;
  retryFailed: () => Promise<SyncResult>;
  clearCompleted: () => void;
}

export function useOfflineSyncStatus(): UseOfflineSyncStatusResult {
  const [status, setStatus] = useState<OfflineSyncStatusEvent>({
    isSyncing: false,
    pendingCount: offlineSync.getPendingCount(),
    failedCount: offlineSync.getFailedCount(),
  });

  useEffect(() => {
    const unsubscribe = offlineSync.subscribe(updated => {
      setStatus(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const syncNow = useCallback(() => offlineSync.processQueue(), []);
  const retryFailed = useCallback(() => offlineSync.retryFailed(), []);
  const clearCompleted = useCallback(() => offlineSync.clearCompleted(), []);

  return {
    ...status,
    syncNow,
    retryFailed,
    clearCompleted,
  };
}

