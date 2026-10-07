import { realtimeTrackingService } from '../src/modules/platform/location/services/realtime-tracking.service';
import type { TrackingTrip } from '../src/modules/platform/location/types/location.types';

const createTestTrip = (tripId: string): TrackingTrip => ({
  tripId,
  orderId: 'ORD-101',
  driver: {
    id: 'drv-1',
    name: 'Test Driver',
    phone: '+1 555-0100',
    rating: 4.8,
    vehicleModel: 'Sedan',
    vehiclePlate: 'TEST-123',
  },
  status: 'on_the_way',
  currentLocation: {
    latitude: 10.0,
    longitude: 20.0,
    heading: 45,
    speed: 30,
    timestamp: Date.now(),
  },
  pickupLocation: {
    id: 'pick-1',
    label: 'Other',
    formattedAddress: '100 Test St',
    coordinates: { latitude: 10.0, longitude: 20.0 },
  },
  dropoffLocation: {
    id: 'drop-1',
    label: 'Home',
    formattedAddress: '200 Main St',
    coordinates: { latitude: 10.05, longitude: 20.05 },
  },
  routeCoordinates: [
    { latitude: 10.0, longitude: 20.0 },
    { latitude: 10.02, longitude: 20.02 },
    { latitude: 10.05, longitude: 20.05 },
  ],
  currentRouteIndex: 0,
  etaMinutes: 5,
  distanceRemainingKm: 2.5,
  updatedAt: new Date().toISOString(),
});

describe('Realtime Tracking Service', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('sets and retrieves a trip dynamically', () => {
    const testTrip = createTestTrip('trip-test-1');
    realtimeTrackingService.setTrip(testTrip);

    const retrieved = realtimeTrackingService.getTrip('trip-test-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.tripId).toBe('trip-test-1');
    expect(retrieved?.driver.name).toBe('Test Driver');
  });

  it('subscribes to live trip updates for a registered trip', () => {
    const testTrip = createTestTrip('trip-test-2');
    realtimeTrackingService.setTrip(testTrip);

    const emittedTrips: TrackingTrip[] = [];
    const unsubscribe = realtimeTrackingService.subscribeToTrip(
      'trip-test-2',
      trip => {
        emittedTrips.push(trip);
      }
    );

    expect(emittedTrips.length).toBe(1);
    expect(emittedTrips[0].tripId).toBe('trip-test-2');

    unsubscribe();
  });

  it('triggers error callback when subscribing to an unknown trip', () => {
    const onError = jest.fn();
    realtimeTrackingService.subscribeToTrip('non-existent-trip', () => {}, onError);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('runs dynamic simulation along route coordinates and stops cleanly', () => {
    const testTrip = createTestTrip('trip-test-sim');
    const emittedTrips: TrackingTrip[] = [];

    const unsubscribe = realtimeTrackingService.startTripSimulation(testTrip, trip => {
      emittedTrips.push(trip);
    });

    expect(emittedTrips.length).toBe(1);
    expect(emittedTrips[0].currentRouteIndex).toBe(0);

    // Advance timer by 2.5s
    jest.advanceTimersByTime(2500);
    expect(emittedTrips.length).toBe(2);
    expect(emittedTrips[1].currentRouteIndex).toBe(1);

    unsubscribe();

    // Advance timer after stopping; no new events should emit
    jest.advanceTimersByTime(5000);
    expect(emittedTrips.length).toBe(2);
  });
});
