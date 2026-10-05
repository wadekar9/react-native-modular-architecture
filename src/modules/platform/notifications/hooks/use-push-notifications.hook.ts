import { useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import { queryClient } from '@core/networking/query-client';
import { navigate, navigationRef } from '@core/navigation';
import {
  getInitialPushMessage,
  subscribeToPushMessages,
  type PushMessage,
} from '../services/push.service';
import { EStackScreens } from '@shared/constants/screens.constants';

export const usePushNotifications = (): void => {
  useEffect(() => {
    const handlePushRoute = (route?: EStackScreens) => {
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
        navigate(EStackScreens.NOTIFICATIONS);
      } catch {}
    };

    const handleForeground = (message: PushMessage) => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'notifications'] });

      showMessage({
        message: message.title ?? 'New Notification',
        description: message.body ?? '',
        type: 'info',
        duration: 4000,
        onPress: () => handlePushRoute(message.route as EStackScreens | undefined),
      });
    };

    const handleOpened = (message: PushMessage) => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'notifications'] });
      handlePushRoute(message.route as EStackScreens | undefined);
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
