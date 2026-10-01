import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { type Region } from 'react-native-maps';
import { Crosshair, MapPin, Search } from 'lucide-react-native';
import { showMessage } from 'react-native-flash-message';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { BaseMapView } from '@shared/components/maps';
import { useAppTheme } from '@shared/hooks';
import {
  DEFAULT_COORDINATES,
  type AddressItem,
  type Coordinates,
} from '@core/location';
import {
  useReverseGeocode,
  useSelectedAddress,
  useSetSelectedAddress,
} from '../../location.queries';

type LocationPickerNavProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

const INITIAL_REGION: Region = {
  latitude: DEFAULT_COORDINATES.latitude,
  longitude: DEFAULT_COORDINATES.longitude,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

const LocationPicker = () => {
  const navigation = useNavigation<LocationPickerNavProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => styling(colors), [colors]);
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
          onPress={() => navigation.navigate('AddressSearch')}
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

const styling = (_colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    screen: { flex: 1 },
    map: { flex: 1 },
    topBar: {
      position: 'absolute',
      top: 50,
      left: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    backButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    gpsButton: {
      position: 'absolute',
      right: 16,
      bottom: 180,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    bottomCard: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    addressInfo: {
      flex: 1,
      gap: 4,
    },
    loader: {
      alignSelf: 'flex-start',
      marginVertical: 4,
    },
    confirmBtn: {
      minHeight: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {
      fontWeight: '700',
    },
  });

export default LocationPicker;
