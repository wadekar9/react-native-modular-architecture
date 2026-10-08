import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@core/networking/query-client';
import { setupOnlineManager } from '@core/networking/online-manager';
import { setupQueryCachePersister } from '@core/networking/query-cache-persister';

const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const unsubscribeOnlineManager = setupOnlineManager();
    const unsubscribeCachePersister = setupQueryCachePersister(queryClient);

    return () => {
      if (typeof unsubscribeOnlineManager === 'function') {
        unsubscribeOnlineManager();
      }
      if (typeof unsubscribeCachePersister === 'function') {
        unsubscribeCachePersister();
      }
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;