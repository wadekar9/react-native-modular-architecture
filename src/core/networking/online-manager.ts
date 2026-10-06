import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Subscribes TanStack Query's onlineManager to NetInfo connectivity events.
 * Pauses queries when offline and auto-refetches upon network resumption.
 */
export const setupOnlineManager = (): (() => void) => {
  let unsubscribe: (() => void) | undefined;
  onlineManager.setEventListener(setOnline => {
    unsubscribe = NetInfo.addEventListener(state => {
      setOnline(Boolean(state.isConnected));
    });
    return unsubscribe;
  });
  return () => {
    unsubscribe?.();
  };
};

