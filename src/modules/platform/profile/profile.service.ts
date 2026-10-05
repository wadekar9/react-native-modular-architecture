import { doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { ensureFirebaseIdentity, getFirebaseDatabase, isFirebaseConfigured } from '@core/firebase/firebase';
import { getJson, Storage } from '@core/storage/storage';
import type { IAuthUser } from '@shared/types/user.types';

const LOCAL_PROFILE_KEY = '@profile.details';

export type ProfileDetails = Pick<IAuthUser, 'firstName' | 'lastName' | 'email' | 'avatar'> & {
  phone?: string;
};

export const getProfileDetails = async (): Promise<ProfileDetails | null> => {
  if (!isFirebaseConfigured()) {
    return getJson<ProfileDetails>(LOCAL_PROFILE_KEY) ?? null;
  }

  const uid = await ensureFirebaseIdentity();
  const snapshot = await getDoc(doc(getFirebaseDatabase(), 'users', uid, 'profile', 'details'));
  return snapshot.exists() ? snapshot.data() as ProfileDetails : null;
};

export const saveProfileDetails = async (profile: ProfileDetails): Promise<void> => {
  if (!isFirebaseConfigured()) {
    Storage.set(LOCAL_PROFILE_KEY, profile);
    return;
  }

  const uid = await ensureFirebaseIdentity();
  await setDoc(
    doc(getFirebaseDatabase(), 'users', uid, 'profile', 'details'),
    { ...profile, updatedAt: new Date() },
    { merge: true },
  );
};
