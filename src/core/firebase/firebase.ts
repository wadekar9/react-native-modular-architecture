import { getApps } from '@react-native-firebase/app';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const isFirebaseConfigured = (): boolean => getApps().length > 0;

export const ensureFirebaseIdentity = async (): Promise<string> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured for this app.');
  }

  const auth = getAuth();
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  return user.uid;
};

export const getFirebaseDatabase = () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured for this app.');
  }

  return getFirestore();
};
