import { PermissionsAndroid, Platform } from 'react-native';
import { getMessaging, getToken, onMessage, onNotificationOpenedApp, requestPermission } from '@react-native-firebase/messaging';
import { doc, setDoc } from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase, isFirebaseConfigured } from '@core/firebase/firebase';

export type PushMessage = {
  title?: string;
  body?: string;
  notificationId?: string;
  route?: string;
};

const requestPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await requestPermission(getMessaging());
  return status === 1 || status === 2;
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

export const subscribeToPushMessages = (
  onForegroundMessage: (message: PushMessage) => void,
  onOpenedMessage: (message: PushMessage) => void,
): (() => void) => {
  if (!isFirebaseConfigured()) {
    return () => undefined;
  }

  const messaging = getMessaging();
  const mapMessage = (message: {
    data?: Record<string, string | object>;
    notification?: { title?: string; body?: string };
  }): PushMessage => ({
    title: message.notification?.title,
    body: message.notification?.body,
    notificationId: typeof message.data?.notificationId === 'string' ? message.data.notificationId : undefined,
    route: typeof message.data?.route === 'string' ? message.data.route : undefined,
  });

  const unsubscribeForeground = onMessage(messaging, message => onForegroundMessage(mapMessage(message)));
  const unsubscribeOpened = onNotificationOpenedApp(messaging, message => onOpenedMessage(mapMessage(message)));

  return () => {
    unsubscribeForeground();
    unsubscribeOpened();
  };
};
