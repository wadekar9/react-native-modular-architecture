import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, type ViewStyle } from 'react-native';
import MapView, { Polyline, type Region } from 'react-native-maps';
import { Navigation, Maximize2, Compass } from 'lucide-react-native';
import { BaseMapView, CustomMarker } from '@shared/components/maps';
import { useAppTheme } from '@shared/hooks';
import { COLORS } from '@shared/constants/colors.constants';
import { moderateScale } from '@shared/constants/styles.constants';
import { useAppTranslation } from '@core/i18n';
import type { TrackingTrip, Coordinates } from '../types/location.types';

export interface LiveMapViewProps {
  trip: TrackingTrip;
  style?: ViewStyle;
  showControls?: boolean;
  onRegionChange?: (region: Region) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  trip,
  style,
  showControls = true,
  onRegionChange,
}) => {
  const mapRef = useRef<MapView>(null);
  const { theme } = useAppTheme();
  const { common_t } = useAppTranslation();
  const colors = COLORS[theme];

  const driverCoord = useMemo<Coordinates>(() => ({
    latitude: trip.currentLocation.latitude,
    longitude: trip.currentLocation.longitude,
  }), [trip.currentLocation.latitude, trip.currentLocation.longitude]);

  const remainingRoute = useMemo(() => {
    const fromIndex = Math.min(trip.currentRouteIndex, trip.routeCoordinates.length - 1);
    const slice = trip.routeCoordinates.slice(fromIndex);
    return [driverCoord, ...slice];
  }, [trip.currentRouteIndex, trip.routeCoordinates, driverCoord]);

  const completedRoute = useMemo(() => {
    const toIndex = Math.min(trip.currentRouteIndex + 1, trip.routeCoordinates.length);
    return trip.routeCoordinates.slice(0, toIndex);
  }, [trip.currentRouteIndex, trip.routeCoordinates]);

  // Initial fit to show pickup, dropoff, and driver
  useEffect(() => {
    if (!mapRef.current || trip.routeCoordinates.length === 0) return;

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [
          trip.pickupLocation.coordinates,
          trip.dropoffLocation.coordinates,
          driverCoord,
        ],
        {
          edgePadding: { top: 80, right: 60, bottom: 260, left: 60 },
          animated: true,
        }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [trip.pickupLocation.coordinates, trip.dropoffLocation.coordinates, driverCoord, trip.routeCoordinates.length]);

  const handleRecenterOnDriver = useCallback(() => {
    mapRef.current?.animateCamera(
      {
        center: driverCoord,
        zoom: 17,
        heading: trip.currentLocation.heading || 0,
        pitch: 45,
      },
      { duration: 800 }
    );
  }, [driverCoord, trip.currentLocation.heading]);

  const handleFitEntireRoute = useCallback(() => {
    mapRef.current?.fitToCoordinates(
      [
        trip.pickupLocation.coordinates,
        trip.dropoffLocation.coordinates,
        driverCoord,
      ],
      {
        edgePadding: { top: 80, right: 60, bottom: 260, left: 60 },
        animated: true,
      }
    );
  }, [trip.pickupLocation.coordinates, trip.dropoffLocation.coordinates, driverCoord]);

  return (
    <View style={[styles.container, style]}>
      <BaseMapView
        ref={mapRef}
        initialRegion={{
          latitude: driverCoord.latitude,
          longitude: driverCoord.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        onRegionChangeComplete={onRegionChange}
        style={StyleSheet.absoluteFill}
      >
        {/* Completed route polyline (subtle) */}
        {completedRoute.length > 1 && (
          <Polyline
            coordinates={completedRoute}
            strokeColor={theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}
            strokeWidth={4}
            lineDashPattern={[2, 4]}
          />
        )}

        {/* Remaining route polyline (vibrant brand) */}
        {remainingRoute.length > 1 && (
          <Polyline
            coordinates={remainingRoute}
            strokeColor={colors['brand-primary']}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Pickup marker (e.g. restaurant or sender) */}
        <CustomMarker
          coordinate={trip.pickupLocation.coordinates}
          variant="restaurant"
          pinColor="#F59E0B"
          title={common_t('PICKUP')}
          description={trip.pickupLocation.formattedAddress}
        />

        {/* Dropoff marker (customer address) */}
        <CustomMarker
          coordinate={trip.dropoffLocation.coordinates}
          variant="home"
          pinColor="#22C55E"
          title={common_t('DROPOFF')}
          description={trip.dropoffLocation.formattedAddress}
        />

        {/* Live moving driver marker with heading rotation */}
        <CustomMarker
          coordinate={driverCoord}
          variant="driver"
          pinColor={colors['brand-primary']}
          flat={true}
          rotation={trip.currentLocation.heading ?? 0}
          anchor={{ x: 0.5, y: 0.5 }}
          title={trip.driver.name}
          description={`${trip.driver.vehicleModel} • ${trip.driver.vehiclePlate}`}
        />
      </BaseMapView>

      {/* Floating Control Buttons */}
      {showControls && (
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={handleRecenterOnDriver}
            accessibilityRole="button"
            accessibilityLabel={common_t('RECENTER_MAP_ON_DRIVER')}
          >
            <Navigation size={moderateScale(20)} color={colors['brand-primary']} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={handleFitEntireRoute}
            accessibilityRole="button"
            accessibilityLabel={common_t('FIT_ENTIRE_ROUTE')}
          >
            <Maximize2 size={moderateScale(18)} color={colors['icon-default']} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={handleRecenterOnDriver}
            accessibilityRole="button"
            accessibilityLabel={common_t('ALIGN_COMPASS_HEADING')}
          >
            <Compass size={moderateScale(19)} color={colors['icon-default']} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LiveMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  floatingControls: {
    position: 'absolute',
    right: moderateScale(16),
    top: moderateScale(60),
    gap: moderateScale(10),
  },
  controlButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

