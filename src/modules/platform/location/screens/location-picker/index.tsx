import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
} from 'react-native';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';
import MapView, { type Region } from 'react-native-maps';
import { Crosshair, MapPin, Search } from 'lucide-react-native';
import { showMessage } from 'react-native-flash-message';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { BaseMapView } from '@shared/components/maps';
import { useAppTheme } from '@shared/hooks';
import { DEFAULT_COORDINATES } from '../../services/geocoding.service';
import type { AddressItem, Coordinates } from '../../types/location.types';
import {
  useReverseGeocode,
  useSelectedAddress,
  useSetSelectedAddress,
} from '../../location.queries';
import { styling } from './styles';

const INITIAL_REGION: Region = {
  latitude: DEFAULT_COORDINATES.latitude,
  longitude: DEFAULT_COORDINATES.longitude,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

const LocationPicker: React.FC<AppStackScreenProps<EStackScreens.LOCATION_PICKER>> = ({ navigation }) => {

  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const mapRef = useRef<MapView>(null);

  const selectedAddrQuery = useSelectedAddress();
  const selectAddress = useSetSelectedAddress();
  const reverseGeocodeMutation = useReverseGeocode();

  const [currentAddress, setCurrentAddress] = useState<AddressItem>(
    selectedAddrQuery.data ?? {
      id: 'initial',
      label: 'Other',
      formattedAddress: 'San Francisco, CA',
      coordinates: DEFAULT_COORDINATES,
    },
  );

  useEffect(() => {
    if (selectedAddrQuery.data) {
      setCurrentAddress(selectedAddrQuery.data);
      mapRef.current?.animateToRegion({
        latitude: selectedAddrQuery.data.coordinates.latitude,
        longitude: selectedAddrQuery.data.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, [selectedAddrQuery.data]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      const coords: Coordinates = {
        latitude: region.latitude,
        longitude: region.longitude,
      };

      reverseGeocodeMutation.mutate(coords, {
        onSuccess: (addr) => {
          setCurrentAddress(addr);
        },
      });
    },
    [reverseGeocodeMutation],
  );

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 600);
    handleRegionChangeComplete(INITIAL_REGION);
  };

  const handleConfirmLocation = async () => {
    await selectAddress.mutateAsync(currentAddress);
    showMessage({
      message: 'Location Updated',
      description: currentAddress.formattedAddress,
      type: 'success',
    });
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.screen}>
      <BaseMapView
        ref={mapRef}
        initialRegion={INITIAL_REGION}
        showCenterPin={true}
        onCenterCoordinatesChange={handleRegionChangeComplete}
        style={styles.map}
      />

      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.surface }]}
        >
          <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Back</ThemeText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate(EStackScreens.ADDRESS_SEARCH)}
          style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Search size={18} color={colors['text-muted']} />
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }} numberOfLines={1}>
            Search for area, street name...
          </ThemeText>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleRecenter}
        style={[styles.gpsButton, { backgroundColor: colors.surface }]}
      >
        <Crosshair size={22} color={colors['brand-primary']} />
      </Pressable>

      <View style={[styles.bottomCard, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <MapPin size={24} color={colors['brand-primary']} />
          <View style={styles.addressInfo}>
            <ThemeText variant="h4">Select delivery location</ThemeText>
            {reverseGeocodeMutation.isPending ? (
              <ActivityIndicator size="small" color={colors['brand-primary']} style={styles.loader} />
            ) : (
              <ThemeText variant="body5" style={{ color: colors['text-secondary'] }} numberOfLines={2}>
                {currentAddress.formattedAddress}
              </ThemeText>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleConfirmLocation}
          disabled={selectAddress.isPending}
          style={[styles.confirmBtn, { backgroundColor: colors['brand-primary'] }]}
        >
          <ThemeText variant="body5" style={[styles.confirmText, { color: colors.surface }]}>
            {selectAddress.isPending ? 'Confirming...' : 'Confirm Delivery Location'}
          </ThemeText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

export default LocationPicker;
