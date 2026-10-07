import type { Coordinates, MapRegion } from '../types/location.types';

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

/**
 * Calculates the forward azimuth/bearing (heading) between two coordinates in degrees (0 - 360).
 */
export const calculateBearing = (start: Coordinates, end: Coordinates): number => {
  const startLat = toRadians(start.latitude);
  const startLng = toRadians(start.longitude);
  const endLat = toRadians(end.latitude);
  const endLng = toRadians(end.longitude);

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const brng = toDegrees(Math.atan2(y, x));
  return (brng + 360) % 360;
};

/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export const calculateDistanceKm = (coord1: Coordinates, coord2: Coordinates): number => {
  const earthRadiusKm = 6371;

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLng = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
};

/**
 * Calculates ETA in minutes given a distance and average speed in km/h.
 */
export const calculateEtaMinutes = (distanceKm: number, avgSpeedKmh = 30): number => {
  if (distanceKm <= 0.05) return 1;
  const hours = distanceKm / avgSpeedKmh;
  return Math.max(1, Math.round(hours * 60));
};

/**
 * Generates intermediate waypoints between start and end coordinates with realistic slight road jitter.
 */
export const generateWaypoints = (
  start: Coordinates,
  end: Coordinates,
  steps = 15
): Coordinates[] => {
  const points: Coordinates[] = [];
  const totalSteps = Math.max(2, steps);

  for (let i = 0; i <= totalSteps; i++) {
    const fraction = i / totalSteps;
    // Slight sinusoidal offset to emulate real streets
    const curvature = Math.sin(fraction * Math.PI) * 0.0015;

    points.push({
      latitude: start.latitude + (end.latitude - start.latitude) * fraction + curvature,
      longitude: start.longitude + (end.longitude - start.longitude) * fraction - curvature * 0.5,
    });
  }

  return points;
};

/**
 * Computes bounding MapRegion that fits all supplied coordinates.
 */
export const getBoundingRegion = (coordinates: Coordinates[], paddingMultiplier = 1.3): MapRegion => {
  if (!coordinates || coordinates.length === 0) {
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const latDelta = Math.max(0.01, (maxLat - minLat) * paddingMultiplier);
  const lngDelta = Math.max(0.01, (maxLng - minLng) * paddingMultiplier);

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

