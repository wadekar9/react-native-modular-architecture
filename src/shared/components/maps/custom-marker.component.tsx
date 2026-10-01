import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker, type MapMarkerProps } from 'react-native-maps';
import { MapPin, Navigation, ShoppingBag, Utensils, Home, Briefcase } from 'lucide-react-native';
import { useAppTheme } from '@shared/hooks';

export type MarkerVariant = 'default' | 'restaurant' | 'store' | 'driver' | 'home' | 'work';

export interface CustomMarkerProps extends MapMarkerProps {
  variant?: MarkerVariant;
  badgeText?: string;
  pinColor?: string;
  iconColor?: string;
  children?: React.ReactNode;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  variant = 'default',
  pinColor,
  iconColor = '#FFFFFF',
  children,
  ...props
}) => {
  const { colors } = useAppTheme();
  const effectivePinColor = pinColor ?? colors['brand-primary'];

  const renderIcon = () => {
    switch (variant) {
      case 'restaurant':
        return <Utensils size={18} color={iconColor} />;
      case 'store':
        return <ShoppingBag size={18} color={iconColor} />;
      case 'driver':
        return <Navigation size={18} color={iconColor} />;
      case 'home':
        return <Home size={18} color={iconColor} />;
      case 'work':
        return <Briefcase size={18} color={iconColor} />;
      default:
        return <MapPin size={18} color={iconColor} />;
    }
  };

  return (
    <Marker {...props}>
      {children ?? (
        <View style={styles.markerContainer}>
          <View style={[styles.bubble, { backgroundColor: effectivePinColor }]}>
            {renderIcon()}
          </View>
          <View style={[styles.arrow, { borderTopColor: effectivePinColor }]} />
        </View>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default CustomMarker;
