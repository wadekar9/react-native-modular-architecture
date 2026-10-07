import { PermissionManager } from '@core/permissions';
import type { Coordinates, LiveLocation } from '../types/location.types';

class DeviceLocationService {
  private static instance: DeviceLocationService;
  private permissionManager = PermissionManager.getInstance();
  private watchListeners: Set<(loc: LiveLocation) => void> = new Set();
  private watchIntervalId: ReturnType<typeof setInterval> | null = null;
  private currentLoc: LiveLocation | null = null;

  private constructor() {}

  public static getInstance(): DeviceLocationService {
    if (!DeviceLocationService.instance) {
      DeviceLocationService.instance = new DeviceLocationService();
    }
    return DeviceLocationService.instance;
  }

  public async requestLocationPermission(): Promise<boolean> {
    const result = await this.permissionManager.requestPermission('location');
    return result.granted;
  }

  public async getCurrentPosition(): Promise<LiveLocation | null> {
    return this.currentLoc ? { ...this.currentLoc, timestamp: Date.now() } : null;
  }

  public setManualPosition(coords: Coordinates): void {
    this.currentLoc = {
      ...coords,
      heading: this.currentLoc?.heading ?? 0,
      speed: this.currentLoc?.speed ?? 0,
      timestamp: Date.now(),
    };
    this.notifyListeners();
  }

  public startWatching(onLocation: (loc: LiveLocation) => void): () => void {
    this.watchListeners.add(onLocation);
    if (this.currentLoc) {
      onLocation(this.currentLoc);
    }

    return () => {
      this.watchListeners.delete(onLocation);
      if (this.watchListeners.size === 0 && this.watchIntervalId) {
        clearInterval(this.watchIntervalId);
        this.watchIntervalId = null;
      }
    };
  }

  private notifyListeners(): void {
    if (!this.currentLoc) return;
    const loc = { ...this.currentLoc };
    this.watchListeners.forEach(fn => fn(loc));
  }
}

export const deviceLocationService = DeviceLocationService.getInstance();
