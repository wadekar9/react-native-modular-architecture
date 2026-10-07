import {
  calculateBearing,
  calculateDistanceKm,
  calculateEtaMinutes,
  generateWaypoints,
  getBoundingRegion,
} from '../src/modules/platform/location/utils/geo.utils';

describe('Geo Utilities', () => {
  const coordA = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
  const coordB = { latitude: 37.7897, longitude: -122.4012 }; // ~2 km northeast

  it('calculates bearing between two coordinates', () => {
    const bearing = calculateBearing(coordA, coordB);
    expect(typeof bearing).toBe('number');
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThanOrEqual(360);
    // Heading northeast should roughly be between 30 and 70 degrees
    expect(bearing).toBeGreaterThan(20);
    expect(bearing).toBeLessThan(80);
  });

  it('calculates distance between two coordinates in kilometers using Haversine', () => {
    const dist = calculateDistanceKm(coordA, coordB);
    expect(dist).toBeGreaterThan(1);
    expect(dist).toBeLessThan(4);
  });

  it('calculates ETA in minutes based on distance and average speed', () => {
    const eta = calculateEtaMinutes(5, 30); // 5 km at 30 km/h = 10 mins
    expect(eta).toBe(10);

    const etaShort = calculateEtaMinutes(0.01);
    expect(etaShort).toBe(1);
  });

  it('generates intermediate waypoints between start and end', () => {
    const steps = 10;
    const waypoints = generateWaypoints(coordA, coordB, steps);
    expect(waypoints.length).toBe(steps + 1);
    expect(waypoints[0].latitude).toBeCloseTo(coordA.latitude, 2);
    expect(waypoints[waypoints.length - 1].latitude).toBeCloseTo(coordB.latitude, 2);
  });

  it('computes a bounding region that encompasses all coordinates', () => {
    const region = getBoundingRegion([coordA, coordB]);
    expect(region.latitudeDelta).toBeGreaterThan(0);
    expect(region.longitudeDelta).toBeGreaterThan(0);
    expect(region.latitude).toBeCloseTo((coordA.latitude + coordB.latitude) / 2, 2);
  });
});

