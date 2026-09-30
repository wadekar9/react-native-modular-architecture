import { useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import { rootNavigationRef } from '@app/navigation/navigation';
import { queryClient } from '@app/providers/query.provider';
import {
  getInitialPushMessage,
  subscribeToPushMessages,
  type PushMessage,
} from '@core/notifications/push.service';

export const usePushNotifications = (): void => {
  useEffect(() => {
    const handlePushRoute = (route?: string) => {
      if (!rootNavigationRef.isReady()) {
        return;
      }

      if (route && (rootNavigationRef as any).isReady()) {
        try {
          (rootNavigationRef as any).navigate(route);
          return;
        } catch {}
      }

      try {
        (rootNavigationRef as any).navigate('Notifications');
      } catch {}
    };

    const handleForeground = (message: PushMessage) => {
      // Invalidate notifications query to refresh UI
      queryClient.invalidateQueries({ queryKey: ['platform', 'notifications'] });

      showMessage({
        message: message.title ?? 'New Notification',
        description: message.body ?? '',
        type: 'info',
        duration: 4000,
        onPress: () => handlePushRoute(message.route),
      });
    };

    const handleOpened = (message: PushMessage) => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'notifications'] });
      handlePushRoute(message.route);
    };

    // Check if app was launched via push notification from quit state
    getInitialPushMessage().then(initialMessage => {
      if (initialMessage) {
        // Wait briefly for navigator to become ready
        setTimeout(() => handlePushRoute(initialMessage.route), 600);
      }
    });

    const unsubscribe = subscribeToPushMessages(handleForeground, handleOpened);

    return () => {
      unsubscribe();
    };
  }, []);
};
