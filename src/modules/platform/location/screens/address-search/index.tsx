import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import type { AppStackScreenProps } from '@shared/types/navigation.types';
import { EStackScreens } from '@shared/constants/screens.constants';
import { Crosshair, MapPin, Search, X, Home, Briefcase } from 'lucide-react-native';
import { showMessage } from 'react-native-flash-message';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import {
  DEFAULT_ADDRESS,
  type AddressItem,
  type PlacePrediction,
} from '@core/location';
import {
  useSavedAddresses,
  useSearchPlaces,
  useSetSelectedAddress,
} from '../../location.queries';
import { styling } from './styles';

const AddressSearch: React.FC<AppStackScreenProps<EStackScreens.ADDRESS_SEARCH>> = ({ navigation }) => {

  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  const [queryText, setQueryText] = useState('');
  const searchResults = useSearchPlaces(queryText);
  const savedAddressesQuery = useSavedAddresses();
  const selectAddress = useSetSelectedAddress();

  const savedAddresses = React.useMemo(
    () => savedAddressesQuery.data ?? [],
    [savedAddressesQuery.data],
  );

  const places = React.useMemo(
    () => searchResults.data ?? [],
    [searchResults.data],
  );

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    const newAddress: AddressItem = {
      id: `addr-${prediction.placeId}`,
      label: 'Other',
      formattedAddress: prediction.description,
      coordinates: prediction.coordinates ?? DEFAULT_ADDRESS.coordinates,
    };

    await selectAddress.mutateAsync(newAddress);
    showMessage({
      message: 'Address Selected',
      description: newAddress.formattedAddress,
      type: 'success',
    });
    navigation.goBack();
  };

  const handleSelectSaved = async (address: AddressItem) => {
    await selectAddress.mutateAsync(address);
    showMessage({
      message: 'Address Selected',
      description: address.formattedAddress,
      type: 'success',
    });
    navigation.goBack();
  };

  const handleUseCurrentLocation = async () => {
    await selectAddress.mutateAsync(DEFAULT_ADDRESS);
    showMessage({
      message: 'Current Location Set',
      description: DEFAULT_ADDRESS.formattedAddress,
      type: 'success',
    });
    navigation.goBack();
  };

  const renderSavedAddress = ({ item }: { item: AddressItem }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => handleSelectSaved(item)}
      style={[styles.savedItem, { borderColor: colors.border }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors['brand-primary-soft'] }]}>
        {item.label === 'Home' ? (
          <Home size={18} color={colors['brand-primary']} />
        ) : item.label === 'Work' ? (
          <Briefcase size={18} color={colors['brand-primary']} />
        ) : (
          <MapPin size={18} color={colors['brand-primary']} />
        )}
      </View>
      <View style={styles.addressTextWrapper}>
        <ThemeText variant="body5" style={styles.savedLabel}>{item.label}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-secondary'] }} numberOfLines={1}>
          {item.formattedAddress}
        </ThemeText>
      </View>
    </Pressable>
  );

  const renderPrediction = ({ item }: { item: PlacePrediction }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => handleSelectPrediction(item)}
      style={[styles.predictionItem, { borderBottomColor: colors.border }]}
    >
      <MapPin size={20} color={colors['brand-primary']} />
      <View style={styles.predictionText}>
        <ThemeText variant="body5" style={styles.predictionPrimary}>{item.primaryText}</ThemeText>
        <ThemeText variant="body5" style={{ color: colors['text-muted'] }} numberOfLines={1}>
          {item.secondaryText}
        </ThemeText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ThemeText variant="body5" style={{ color: colors['brand-primary'] }}>Back</ThemeText>
        </Pressable>
        <ThemeText variant="h2">Select address</ThemeText>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Search size={18} color={colors['text-muted']} />
          <TextInput
            placeholder="Search for area, street, or landmark"
            placeholderTextColor={colors['text-muted']}
            value={queryText}
            onChangeText={setQueryText}
            autoFocus={true}
            style={[styles.input, { color: colors['text-primary'] }]}
          />
          {queryText.length > 0 ? (
            <Pressable accessibilityRole="button" onPress={() => setQueryText('')}>
              <X size={18} color={colors['text-muted']} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleUseCurrentLocation}
        style={[styles.currentLocationRow, { borderBottomColor: colors.border }]}
      >
        <Crosshair size={20} color={colors['brand-primary']} />
        <View style={styles.currentLocationText}>
          <ThemeText variant="body5" style={[styles.currentLocationTitle, { color: colors['brand-primary'] }]}>
            Use current location
          </ThemeText>
          <ThemeText variant="body5" style={{ color: colors['text-muted'] }}>
            Using GPS for accurate delivery
          </ThemeText>
        </View>
      </Pressable>

      {queryText.trim().length === 0 ? (
        <View style={styles.savedSection}>
          <ThemeText variant="h4" style={styles.sectionTitle}>Saved addresses</ThemeText>
          <FlatList
            data={savedAddresses}
            keyExtractor={item => item.id}
            renderItem={renderSavedAddress}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={item => item.placeId}
          renderItem={renderPrediction}
          contentContainerStyle={styles.predictionsList}
        />
      )}
    </ThemedView>
  );
};

export default AddressSearch;
