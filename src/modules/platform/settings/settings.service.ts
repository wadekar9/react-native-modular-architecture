import { doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase, isFirebaseConfigured } from '@core/firebase/firebase';
import { getJson, Storage } from '@core/storage/storage';

const LOCAL_SETTINGS_KEY = '@settings.preferences';

export type AppSettings = {
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  pushNotificationsEnabled: false,
  emailNotificationsEnabled: true,
};

export const getAppSettings = async (): Promise<AppSettings> => {
  if (!isFirebaseConfigured()) {
    return { ...DEFAULT_SETTINGS, ...getJson<Partial<AppSettings>>(LOCAL_SETTINGS_KEY) };
  }

  const uid = await ensureFirebaseIdentity();
  const snapshot = await getDoc(doc(getFirebaseDatabase(), 'users', uid, 'preferences', 'app'));
  return snapshot.exists()
    ? { ...DEFAULT_SETTINGS, ...snapshot.data() as Partial<AppSettings> }
    : DEFAULT_SETTINGS;
};

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  if (!isFirebaseConfigured()) {
    Storage.set(LOCAL_SETTINGS_KEY, settings);
    return;
  }

  const uid = await ensureFirebaseIdentity();
  await setDoc(
    doc(getFirebaseDatabase(), 'users', uid, 'preferences', 'app'),
    { ...settings, updatedAt: new Date() },
    { merge: true },
  );
};
