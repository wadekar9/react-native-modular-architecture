import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notifications.service';

export const notificationsQueryKey = ['platform', 'notifications'] as const;

export const useNotifications = () => useQuery({
  queryKey: notificationsQueryKey,
  queryFn: getNotifications,
  refetchInterval: 60_000,
});

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey }),
  });
};

export const useAddNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Parameters<typeof addNotification>[0]) =>
      addNotification(item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey }),
  });
};
