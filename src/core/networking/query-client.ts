import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 60 * 24, // 24 hours offline persistence
      networkMode: 'offlineFirst', // Serve local cached data immediately while offline
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});
