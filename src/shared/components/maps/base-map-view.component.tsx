import React, { forwardRef } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  type MapViewProps,
  type Region,
} from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { useAppTheme } from '@shared/hooks';
import { GOOGLE_MAPS_DARK_STYLE } from './map.constants';

export interface BaseMapViewProps extends MapViewProps {
  style?: ViewStyle;
  showCenterPin?: boolean;
  pinColor?: string;
  onCenterCoordinatesChange?: (region: Region) => void;
  children?: React.ReactNode;
}

export const BaseMapView = forwardRef<MapView, BaseMapViewProps>(
  (
    {
      style,
      showCenterPin = false,
      pinColor,
      onCenterCoordinatesChange,
      children,
      customMapStyle,
      ...mapProps
    },
    ref,
  ) => {
    const { theme, colors } = useAppTheme();
    const effectivePinColor = pinColor ?? colors['brand-primary'];

    const activeMapStyle =
      customMapStyle ?? (theme === 'dark' ? GOOGLE_MAPS_DARK_STYLE : undefined);

    return (
      <View style={[styles.container, style]}>
        <MapView
          ref={ref}
          provider={PROVIDER_GOOGLE}
          customMapStyle={activeMapStyle}
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          style={StyleSheet.absoluteFill}
          onRegionChangeComplete={onCenterCoordinatesChange}
          {...mapProps}
        >
          {children}
        </MapView>

        {showCenterPin ? (
          <View pointerEvents="none" style={styles.centerPinWrapper}>
            <View style={styles.pinOffset}>
              <MapPin size={40} color={effectivePinColor} fill={effectivePinColor} />
            </View>
            <View style={[styles.pinDot, { backgroundColor: colors['text-primary'] }]} />
          </View>
        ) : null}
      </View>
    );
  },
);

BaseMapView.displayName = 'BaseMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  centerPinWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOffset: {
    transform: [{ translateY: -20 }],
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
    transform: [{ translateY: -20 }],
  },
});

export default BaseMapView;
