import type { Permission } from 'react-native-permissions';

export type PlatformPermissions = {
  android: Permission[];
  ios: Permission[];
};

export interface PermissionResult {
  granted: boolean;
  error?: Error;
}

export type AppPermissionType = 'camera' | 'media' | 'location' | 'notification';

