import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
} from '../services/notifications.api';
import { notificationKeys } from './notification.keys';
import type { INotification, NotificationFilter } from '../types/notification.types';

export const useNotifications = (filter: NotificationFilter = 'all', userId?: string) => {
  return useQuery({
    queryKey: notificationKeys.list(filter),
    queryFn: async (): Promise<INotification[]> => {
      const data = await fetchNotificationsApi(userId);
      if (filter === 'unread') {
        return data.filter(item => !item.isRead);
      }
      if (filter !== 'all') {
        return data.filter(item => item.type === filter);
      }
      return data;
    },
  });
};

export const useUnreadNotificationsCount = (userId?: string) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async (): Promise<number> => {
      const data = await fetchNotificationsApi(userId);
      return data.filter(item => !item.isRead).length;
    },
  });
};

export const useMarkNotificationAsRead = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsReadApi(notificationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsAsRead = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsReadApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useDeleteNotification = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotificationApi(notificationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useClearAllNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearAllNotificationsApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

