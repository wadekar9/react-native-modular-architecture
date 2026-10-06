import { isFirebaseConfigured, getFirebaseDatabase, ensureFirebaseIdentity } from '@core/firebase/firebase';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  writeBatch,
  type DocumentData,
  type QuerySnapshot,
} from '@react-native-firebase/firestore';
import { Storage, getJson } from '@core/storage/storage';
import type { INotification } from '../types/notification.types';

const NOTIFICATIONS_STORAGE_KEY = '@notifications.list';

const getLocalNotifications = (): INotification[] => {
  const stored = getJson<INotification[]>(NOTIFICATIONS_STORAGE_KEY);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  return [];
};

const saveLocalNotifications = (notifications: INotification[]): void => {
  Storage.set(NOTIFICATIONS_STORAGE_KEY, notifications);
};

export const fetchNotificationsApi = async (userId?: string): Promise<INotification[]> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = userId || (await ensureFirebaseIdentity());
      const firestore = getFirebaseDatabase();
      const notifRef = collection(firestore, 'users', uid, 'notifications');
      const q = query(notifRef, orderBy('createdAt', 'desc'));
      const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs.map(item => {
          const data = item.data();
          const createdAt = data?.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : (data.createdAt || new Date().toISOString());

          return {
            id: item.id,
            title: data.title ?? '',
            body: data.body ?? '',
            type: data.type ?? 'general',
            createdAt,
            isRead: Boolean(data.isRead),
            data: data.data,
            route: data.route,
          };
        });
      }
    } catch {
      // Fallback to local storage if Firestore query fails
    }
  }

  return getLocalNotifications();
};

export const markNotificationAsReadApi = async (notificationId: string, userId?: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = userId || (await ensureFirebaseIdentity());
      const firestore = getFirebaseDatabase();
      const notifDocRef = doc(firestore, 'users', uid, 'notifications', notificationId);
      await updateDoc(notifDocRef, { isRead: true });
    } catch {
      // Fallback to local storage
    }
  }

  const list = getLocalNotifications();
  const updated = list.map(n => (n.id === notificationId ? { ...n, isRead: true } : n));
  saveLocalNotifications(updated);
};

export const markAllNotificationsAsReadApi = async (userId?: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = userId || (await ensureFirebaseIdentity());
      const firestore = getFirebaseDatabase();
      const notifRef = collection(firestore, 'users', uid, 'notifications');
      const snapshot = await getDocs(notifRef);

      const batch = writeBatch(firestore);
      snapshot.docs.forEach(docSnap => {
        if (!docSnap.data().isRead) {
          batch.update(docSnap.ref, { isRead: true });
        }
      });
      await batch.commit();
    } catch {
      // Fallback to local storage
    }
  }

  const list = getLocalNotifications();
  const updated = list.map(n => ({ ...n, isRead: true }));
  saveLocalNotifications(updated);
};

export const deleteNotificationApi = async (notificationId: string, userId?: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = userId || (await ensureFirebaseIdentity());
      const firestore = getFirebaseDatabase();
      const notifDocRef = doc(firestore, 'users', uid, 'notifications', notificationId);
      await deleteDoc(notifDocRef);
    } catch {
      // Fallback to local storage
    }
  }

  const list = getLocalNotifications();
  const updated = list.filter(n => n.id !== notificationId);
  saveLocalNotifications(updated);
};

export const clearAllNotificationsApi = async (userId?: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const uid = userId || (await ensureFirebaseIdentity());
      const firestore = getFirebaseDatabase();
      const notifRef = collection(firestore, 'users', uid, 'notifications');
      const snapshot = await getDocs(notifRef);

      const batch = writeBatch(firestore);
      snapshot.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch {
      // Fallback to local storage
    }
  }

  saveLocalNotifications([]);
};

