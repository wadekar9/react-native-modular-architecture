import { useState, useEffect, useCallback } from 'react';
import type { LiveLocation } from '../types/location.types';
import { deviceLocationService } from '../services/device-location.service';

export interface UseLiveLocationReturn {
  location: LiveLocation | null;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
}

export const useLiveLocation = (): UseLiveLocationReturn => {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    const granted = await deviceLocationService.requestLocationPermission();
    setIsPermissionGranted(granted);
    return granted;
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const granted = await deviceLocationService.requestLocationPermission();
      setIsPermissionGranted(granted);

      unsubscribe = deviceLocationService.startWatching(latestLoc => {
        setLocation(latestLoc);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    location,
    isPermissionGranted,
    requestPermission,
  };
};

