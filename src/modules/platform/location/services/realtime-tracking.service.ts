import { isFirebaseConfigured, getFirebaseDatabase } from '@core/firebase/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  type DocumentSnapshot,
  type DocumentData,
} from '@react-native-firebase/firestore';
import type {
  LiveLocation,
  TrackingTrip,
  TripStatus,
} from '../types/location.types';
import {
  calculateBearing,
  calculateDistanceKm,
  calculateEtaMinutes,
} from '../utils/geo.utils';

class RealtimeTrackingService {
  private static instance: RealtimeTrackingService;
  private activeSimulations: Map<string, ReturnType<typeof setInterval>> = new Map();
  private trips: Map<string, TrackingTrip> = new Map();

  private constructor() {}

  public static getInstance(): RealtimeTrackingService {
    if (!RealtimeTrackingService.instance) {
      RealtimeTrackingService.instance = new RealtimeTrackingService();
    }
    return RealtimeTrackingService.instance;
  }

  /**
   * Sets or caches an active trip dynamically in memory.
   */
  public setTrip(trip: TrackingTrip): void {
    this.trips.set(trip.tripId, trip);
  }

  /**
   * Gets a cached trip by ID.
   */
  public getTrip(tripId: string): TrackingTrip | undefined {
    return this.trips.get(tripId);
  }

  /**
   * Subscribes to real-time trip coordinates.
   * Uses Firestore when available; otherwise checks registered in-memory trip.
   */
  public subscribeToTrip(
    tripId: string,
    onUpdate: (trip: TrackingTrip) => void,
    onError?: (error: unknown) => void
  ): () => void {
    if (!tripId) {
      onError?.(new Error('Trip ID is required'));
      return () => undefined;
    }

    if (isFirebaseConfigured()) {
      try {
        const firestore = getFirebaseDatabase();
        const tripRef = doc(firestore, 'trips', tripId);

        return onSnapshot(
          tripRef,
          (snapshot: DocumentSnapshot<DocumentData>) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as TrackingTrip;
              this.trips.set(tripId, data);
              onUpdate(data);
            } else {
              const local = this.trips.get(tripId);
              if (local) {
                onUpdate(local);
              } else {
                onError?.(new Error(`Trip ${tripId} not found`));
              }
            }
          },
          err => {
            onError?.(err);
            const local = this.trips.get(tripId);
            if (local) {
              onUpdate(local);
            }
          }
        );
      } catch (err) {
        onError?.(err);
      }
    }

    // When Firebase is not configured, rely on dynamically set trip
    const trip = this.trips.get(tripId);
    if (trip) {
      onUpdate({ ...trip });
    } else {
      onError?.(new Error(`Trip ${tripId} not found`));
    }

    return () => undefined;
  }

  /**
   * Starts a real-time motion simulation along the trip's route coordinates.
   */
  public startTripSimulation(
    trip: TrackingTrip,
    onUpdate: (trip: TrackingTrip) => void
  ): () => void {
    const { tripId } = trip;
    this.stopTripSimulation(tripId);
    this.trips.set(tripId, trip);

    // Emit initial state
    onUpdate({ ...trip });

    if (!trip.routeCoordinates || trip.routeCoordinates.length < 2) {
      return () => undefined;
    }

    const intervalId = setInterval(() => {
      const currentTrip = this.trips.get(tripId);
      if (!currentTrip || !currentTrip.routeCoordinates.length) return;

      const totalPoints = currentTrip.routeCoordinates.length;
      let nextIndex = currentTrip.currentRouteIndex + 1;

      if (nextIndex >= totalPoints) {
        nextIndex = 0;
      }

      const currentCoord = currentTrip.routeCoordinates[nextIndex];
      const targetCoord =
        nextIndex + 1 < totalPoints
          ? currentTrip.routeCoordinates[nextIndex + 1]
          : currentTrip.dropoffLocation.coordinates;

      const newHeading = calculateBearing(currentCoord, targetCoord);
      const remainingDistance = calculateDistanceKm(
        currentCoord,
        currentTrip.dropoffLocation.coordinates
      );
      const newEta = calculateEtaMinutes(remainingDistance);

      let newStatus: TripStatus = 'on_the_way';
      if (nextIndex === 0) {
        newStatus = 'picking_up';
      } else if (remainingDistance <= 0.1) {
        newStatus = 'arriving';
      } else if (remainingDistance <= 0.02) {
        newStatus = 'completed';
      }

      const updatedTrip: TrackingTrip = {
        ...currentTrip,
        status: newStatus,
        currentRouteIndex: nextIndex,
        currentLocation: {
          latitude: currentCoord.latitude,
          longitude: currentCoord.longitude,
          heading: newHeading,
          speed: Math.floor(25 + Math.random() * 10),
          timestamp: Date.now(),
        },
        etaMinutes: newEta,
        distanceRemainingKm: remainingDistance,
        updatedAt: new Date().toISOString(),
      };

      this.trips.set(tripId, updatedTrip);
      onUpdate(updatedTrip);
    }, 2500);

    this.activeSimulations.set(tripId, intervalId);

    return () => {
      this.stopTripSimulation(tripId);
    };
  }

  public stopTripSimulation(tripId: string): void {
    const existing = this.activeSimulations.get(tripId);
    if (existing) {
      clearInterval(existing);
      this.activeSimulations.delete(tripId);
    }
  }

  /**
   * Updates driver position in Firestore when publishing driver updates.
   */
  public async updateDriverLocation(
    tripId: string,
    location: LiveLocation
  ): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        const firestore = getFirebaseDatabase();
        const tripRef = doc(firestore, 'trips', tripId);
        await setDoc(tripRef, { currentLocation: location }, { merge: true });
      } catch {
        // Fallback or ignore
      }
    }

    const current = this.trips.get(tripId);
    if (current) {
      current.currentLocation = location;
      this.trips.set(tripId, current);
    }
  }
}

export const realtimeTrackingService = RealtimeTrackingService.getInstance();
