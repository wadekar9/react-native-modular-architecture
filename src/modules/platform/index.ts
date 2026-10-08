export * from './auth';
export * from './location';
export * from './chat';
export * from './notifications';
export * from './settings';
export { default as Routes } from './routes';

import { authManifest } from './auth';
import { locationManifest } from './location';
import { notificationsManifest } from './notifications';
import { settingsManifest } from './settings';
import type { PlatformModuleManifest, PlatformScreenEntry } from '../module.types';

export const platformManifests: PlatformModuleManifest[] = [
  authManifest,
  locationManifest,
  notificationsManifest,
  settingsManifest,
];

export const getPlatformScreens = (): PlatformScreenEntry[] => {
  return platformManifests.reduce<PlatformScreenEntry[]>(
    (acc, manifest) => acc.concat(manifest.screens),
    []
  );
};
