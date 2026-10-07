import { useState, useEffect, useCallback } from 'react';
import type { TrackingTrip } from '../types/location.types';
import { realtimeTrackingService } from '../services/realtime-tracking.service';

export interface UseRealtimeTrackingReturn {
  trip: TrackingTrip | null;
  isLoading: boolean;
  error: unknown;
  stopTracking: () => void;
}

export const useRealtimeTracking = (tripId?: string): UseRealtimeTrackingReturn => {
  const [trip, setTrip] = useState<TrackingTrip | null>(() =>
    tripId ? realtimeTrackingService.getTrip(tripId) ?? null : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    Boolean(tripId && !realtimeTrackingService.getTrip(tripId))
  );
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      setIsLoading(false);
      return;
    }

    const cached = realtimeTrackingService.getTrip(tripId);
    if (cached) {
      setTrip(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    setError(null);

    const unsubscribe = realtimeTrackingService.subscribeToTrip(
      tripId,
      updatedTrip => {
        setTrip(updatedTrip);
        setIsLoading(false);
      },
      err => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [tripId]);

  const stopTracking = useCallback(() => {
    if (tripId) {
      realtimeTrackingService.stopTripSimulation(tripId);
    }
  }, [tripId]);

  return {
    trip,
    isLoading,
    error,
    stopTracking,
  };
};
