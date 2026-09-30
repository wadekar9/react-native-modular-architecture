import React, { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const QueryProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active');
    });
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });

    return () => {
      appStateSubscription.remove();
      unsubscribeNetInfo();
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;