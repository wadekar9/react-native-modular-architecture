import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase } from '@core/firebase/firebase';

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date | null;
  route?: string;
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const uid = await ensureFirebaseIdentity();
  const notificationsRef = collection(getFirebaseDatabase(), 'users', uid, 'notifications');
  const notificationsQuery = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));
  const snapshot = await getDocs(notificationsQuery);

  return snapshot.docs.map(document => {
    const data = document.data();
    const createdAt = data.createdAt;

    return {
      id: document.id,
      title: typeof data.title === 'string' ? data.title : 'Notification',
      body: typeof data.body === 'string' ? data.body : '',
      read: data.read === true,
      createdAt: createdAt && typeof createdAt.toDate === 'function' ? createdAt.toDate() : null,
      route: typeof data.route === 'string' ? data.route : undefined,
    };
  });
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  const uid = await ensureFirebaseIdentity();
  await updateDoc(doc(getFirebaseDatabase(), 'users', uid, 'notifications', notificationId), {
    read: true,
  });
};
