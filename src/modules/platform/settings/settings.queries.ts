import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAppSettings, saveAppSettings, type AppSettings } from './settings.service';

export const settingsQueryKey = ['platform', 'settings'] as const;

export const useAppSettings = () => useQuery({
  queryKey: settingsQueryKey,
  queryFn: getAppSettings,
});

export const useSaveAppSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: AppSettings) => saveAppSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsQueryKey }),
  });
};
