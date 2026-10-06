import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, requestMultiple, Permission } from 'react-native-permissions';
import { getMessaging, requestPermission as requestFcmPermission } from '@react-native-firebase/messaging';
import type { AppPermissionType, PermissionResult, PlatformPermissions } from '../types/permissions.types';

export abstract class BasePermissionHandler {
  protected abstract permissions: PlatformPermissions;

  public async requestPermission(): Promise<PermissionResult> {
    try {
      const platformPermissions = this.getPlatformPermissions();
      if (!platformPermissions || platformPermissions.length === 0) {
        return { granted: true };
      }
      const result = await requestMultiple(platformPermissions);
      return {
        granted: this.validatePermissionResult(result),
      };
    } catch (error) {
      return {
        granted: false,
        error: error instanceof Error ? error : new Error('Unknown permission error occurred'),
      };
    }
  }

  protected getPlatformPermissions(): Permission[] {
    return Platform.select({
      android: this.permissions.android,
      ios: this.permissions.ios,
      default: [],
    }) ?? [];
  }

  protected abstract validatePermissionResult(result: Record<string, string>): boolean;
}

export class CameraPermissionHandler extends BasePermissionHandler {
  protected permissions: PlatformPermissions = {
    android: [PERMISSIONS.ANDROID.CAMERA],
    ios: [PERMISSIONS.IOS.CAMERA],
  };

  protected validatePermissionResult(result: Record<string, string>): boolean {
    return Platform.select({
      android: result[PERMISSIONS.ANDROID.CAMERA] === 'granted',
      ios: result[PERMISSIONS.IOS.CAMERA] === 'granted',
      default: false,
    }) ?? false;
  }
}

export class MediaPermissionHandler extends BasePermissionHandler {
  protected permissions: PlatformPermissions = {
    android: [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ],
    ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
  };

  protected validatePermissionResult(result: Record<string, string>): boolean {
    return Platform.select({
      android:
        result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === 'granted' ||
        result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' ||
        result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted',
      ios: result[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted',
      default: false,
    }) ?? false;
  }
}

export class LocationPermissionHandler extends BasePermissionHandler {
  protected permissions: PlatformPermissions = {
    android: [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    ],
    ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  };

  protected validatePermissionResult(result: Record<string, string>): boolean {
    return Platform.select({
      android:
        result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' ||
        result[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'granted',
      ios: result[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === 'granted',
      default: false,
    }) ?? false;
  }
}

export class NotificationPermissionHandler extends BasePermissionHandler {
  protected permissions: PlatformPermissions = {
    android: [],
    ios: [],
  };

  public async requestPermission(): Promise<PermissionResult> {
    try {
      let granted = false;

      if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
        const response = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        granted = response === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const authStatus = await requestFcmPermission(getMessaging());
        granted = authStatus === 1 || authStatus === 2; // AUTHORIZED or PROVISIONAL
      }

      return { granted };
    } catch (error) {
      return {
        granted: false,
        error: error instanceof Error ? error : new Error('Failed to request notification permission'),
      };
    }
  }

  protected validatePermissionResult(): boolean {
    return false;
  }
}

export class PermissionManager {
  private static instance: PermissionManager;
  private handlers: Map<AppPermissionType, BasePermissionHandler>;

  private constructor() {
    this.handlers = new Map();
    this.initializeHandlers();
  }

  public static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  private initializeHandlers(): void {
    this.handlers.set('camera', new CameraPermissionHandler());
    this.handlers.set('media', new MediaPermissionHandler());
    this.handlers.set('location', new LocationPermissionHandler());
    this.handlers.set('notification', new NotificationPermissionHandler());
  }

  public registerHandler(type: AppPermissionType, handler: BasePermissionHandler): void {
    this.handlers.set(type, handler);
  }

  public async requestPermission(type: AppPermissionType): Promise<PermissionResult> {
    const handler = this.handlers.get(type);
    if (!handler) {
      return {
        granted: false,
        error: new Error(`Unknown permission type: ${type}`),
      };
    }
    return handler.requestPermission();
  }
}

export const permissionManager = PermissionManager.getInstance();

export const requestCameraPermissions = async (): Promise<boolean> => {
  const result = await permissionManager.requestPermission('camera');
  return result.granted;
};

export const requestMediaPermissions = async (): Promise<boolean> => {
  const result = await permissionManager.requestPermission('media');
  return result.granted;
};

export const requestLocationPermissions = async (): Promise<boolean> => {
  const result = await permissionManager.requestPermission('location');
  return result.granted;
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const result = await permissionManager.requestPermission('notification');
  return result.granted;
};

