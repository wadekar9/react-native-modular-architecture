import { useEffect, useState } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useOfflineSyncStatus } from '@core/database/hooks/use-offline-sync-status';

export interface NetworkStatus {
  isConnected: boolean;
  isOffline: boolean;
  isInternetReachable: boolean | null;
  isSyncing: boolean;
  pendingSyncCount: number;
  syncNow: () => Promise<any>;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [netState, setNetState] = useState<Partial<NetInfoState>>({
    isConnected: true,
    isInternetReachable: true,
  });

  const { isSyncing, pendingCount, syncNow } = useOfflineSyncStatus();

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setNetState(state);
    }).catch(() => {});

    const unsubscribe = NetInfo.addEventListener(state => {
      setNetState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isConnected = netState.isConnected !== false;
  const isOffline = !isConnected;

  return {
    isConnected,
    isOffline,
    isInternetReachable: netState.isInternetReachable ?? null,
    isSyncing,
    pendingSyncCount: pendingCount,
    syncNow,
  };
};

