import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase, isFirebaseConfigured } from '@core/firebase/firebase';
import { Storage, getJson } from '@core/storage/storage';
import { EStackScreens } from '@shared/constants/screens.constants';

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date | null;
  route?: EStackScreens;
};

const LOCAL_NOTIFICATIONS_KEY = '@notifications.items';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Welcome to SuperApp! 🎉',
    body: 'Explore food delivery, instant grocery, dining out, and events all in one place.',
    read: false,
    createdAt: new Date(),
    route: EStackScreens.MAIN,
  },
  {
    id: 'notif-2',
    title: 'Complete your profile',
    body: 'Add your contact number and details in Account Details to get personalized deals.',
    read: false,
    createdAt: new Date(Date.now() - 3600000),
    route: EStackScreens.ACCOUNT_DETAILS,
  },
  {
    id: 'notif-3',
    title: 'Notification preferences',
    body: 'Manage your push notifications and alerts in Settings.',
    read: true,
    createdAt: new Date(Date.now() - 86400000),
    route: EStackScreens.SETTINGS,
  },
];

const getLocalNotifications = (): NotificationItem[] => {
  const stored = getJson<NotificationItem[]>(LOCAL_NOTIFICATIONS_KEY);
  if (stored && Array.isArray(stored)) {
    return stored.map(item => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : null,
    }));
  }
  Storage.set(LOCAL_NOTIFICATIONS_KEY, DEFAULT_NOTIFICATIONS);
  return DEFAULT_NOTIFICATIONS;
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  if (!isFirebaseConfigured()) {
    return getLocalNotifications();
  }

  try {
    const uid = await ensureFirebaseIdentity();
    const notificationsRef = collection(getFirebaseDatabase(), 'users', uid, 'notifications');
    const notificationsQuery = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(notificationsQuery);

    if (snapshot.empty) {
      return getLocalNotifications();
    }

    return snapshot.docs.map(document => {
      const data = document.data();
      const createdAt = data.createdAt;

      return {
        id: document.id,
        title: typeof data.title === 'string' ? data.title : 'Notification',
        body: typeof data.body === 'string' ? data.body : '',
        read: data.read === true,
        createdAt: createdAt && typeof createdAt.toDate === 'function' ? createdAt.toDate() : null,
        route: typeof data.route === 'string' ? data.route as EStackScreens : undefined,
      };
    });
  } catch {
    return getLocalNotifications();
  }
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = await ensureFirebaseIdentity();
      await updateDoc(doc(getFirebaseDatabase(), 'users', uid, 'notifications', notificationId), {
        read: true,
      });
    } catch {}
  }

  const local = getLocalNotifications();
  const updated = local.map(item => (item.id === notificationId ? { ...item, read: true } : item));
  Storage.set(LOCAL_NOTIFICATIONS_KEY, updated);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  const local = getLocalNotifications();
  const updated = local.map(item => ({ ...item, read: true }));
  Storage.set(LOCAL_NOTIFICATIONS_KEY, updated);

  if (isFirebaseConfigured()) {
    try {
      const uid = await ensureFirebaseIdentity();
      const db = getFirebaseDatabase();
      await Promise.all(
        local.filter(n => !n.read).map(n =>
          updateDoc(doc(db, 'users', uid, 'notifications', n.id), { read: true }),
        ),
      );
    } catch {}
  }
};

export type NewNotificationInput = Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & {
  read?: boolean;
  createdAt?: Date;
};

export const addNotification = async (
  item: NewNotificationInput,
): Promise<NotificationItem> => {
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: item.title,
    body: item.body,
    read: item.read ?? false,
    createdAt: item.createdAt ?? new Date(),
    route: item.route,
  };

  const local = getLocalNotifications();
  Storage.set(LOCAL_NOTIFICATIONS_KEY, [newNotif, ...local]);

  if (isFirebaseConfigured()) {
    try {
      const uid = await ensureFirebaseIdentity();
      await addDoc(collection(getFirebaseDatabase(), 'users', uid, 'notifications'), {
        ...newNotif,
        createdAt: newNotif.createdAt,
      });
    } catch {}
  }

  return newNotif;
};
