import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@core/networking/query-client';

const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;