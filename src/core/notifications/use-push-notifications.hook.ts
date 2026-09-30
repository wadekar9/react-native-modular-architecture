import { useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import { queryClient } from '@core/networking/query-client';
import { navigate, navigationRef } from '@core/navigation';
import {
  getInitialPushMessage,
  subscribeToPushMessages,
  type PushMessage,
} from './push.service';

export const usePushNotifications = (): void => {
  useEffect(() => {
    const handlePushRoute = (route?: string) => {
      if (!navigationRef.isReady()) {
        return;
      }

      if (route) {
        try {
          navigate(route);
          return;
        } catch {}
      }

      try {
        navigate('Notifications');
      } catch {}
    };

    const handleForeground = (message: PushMessage) => {
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

    getInitialPushMessage().then(initialMessage => {
      if (initialMessage) {
        setTimeout(() => handlePushRoute(initialMessage.route), 600);
      }
    });

    const unsubscribe = subscribeToPushMessages(handleForeground, handleOpened);

    return () => {
      unsubscribe();
    };
  }, []);
};
