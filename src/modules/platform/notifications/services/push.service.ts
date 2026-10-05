import { PermissionsAndroid, Platform } from 'react-native';
import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { doc, setDoc } from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase, isFirebaseConfigured } from '@core/firebase/firebase';
import { EStackScreens } from '@shared/constants/screens.constants';

export type PushMessage = {
  title?: string;
  body?: string;
  notificationId?: string;
  route?: EStackScreens;
};

const requestPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  try {
    const status = await requestPermission(getMessaging());
    return status === 1 || status === 2;
  } catch {
    return false;
  }
};

export const registerPushDevice = async (): Promise<string | null> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Push notifications require Firebase project configuration.');
  }

  const granted = await requestPushPermission();
  if (!granted) {
    return null;
  }

  const uid = await ensureFirebaseIdentity();
  const token = await getToken(getMessaging());
  await setDoc(
    doc(getFirebaseDatabase(), 'users', uid, 'devices', encodeURIComponent(token)),
    { token, platform: Platform.OS, updatedAt: new Date(), enabled: true },
    { merge: true },
  );

  return token;
};

export const getInitialPushMessage = async (): Promise<PushMessage | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    const messaging = getMessaging();
    const message = await getInitialNotification(messaging);
    if (!message) {
      return null;
    }

    return {
      title: message.notification?.title,
      body: message.notification?.body,
      notificationId: typeof message.data?.notificationId === 'string' ? message.data.notificationId : undefined,
      route: typeof message.data?.route === 'string' ? message.data.route as EStackScreens : undefined,
    };
  } catch {
    return null;
  }
};

export const registerBackgroundMessageHandler = (): void => {
  if (!isFirebaseConfigured()) {
    return;
  }

  try {
    const messaging = getMessaging();
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      if (__DEV__) {
        console.log('[FCM Background Message]', remoteMessage.messageId);
      }
    });
  } catch {
    // Gracefully ignore if native background worker cannot register
  }
};

export const subscribeToPushMessages = (
  onForegroundMessage: (message: PushMessage) => void,
  onOpenedMessage: (message: PushMessage) => void,
): (() => void) => {
  if (!isFirebaseConfigured()) {
    return () => undefined;
  }

  try {
    const messaging = getMessaging();
    const mapMessage = (message: {
      data?: Record<string, string | object>;
      notification?: { title?: string; body?: string };
    }): PushMessage => ({
      title: message.notification?.title,
      body: message.notification?.body,
      notificationId: typeof message.data?.notificationId === 'string' ? message.data.notificationId : undefined,
      route: typeof message.data?.route === 'string' ? message.data.route as EStackScreens : undefined,
    });

    const unsubscribeForeground = onMessage(messaging, message => onForegroundMessage(mapMessage(message)));
    const unsubscribeOpened = onNotificationOpenedApp(messaging, message => onOpenedMessage(mapMessage(message)));

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  } catch {
    return () => undefined;
  }
};
