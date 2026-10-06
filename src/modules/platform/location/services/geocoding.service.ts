import { Storage, getJson } from '@core/storage/storage';
import type { AddressItem, Coordinates, PlacePrediction } from '../types/location.types';

const SELECTED_ADDRESS_KEY = '@location.selected_address';
const SAVED_ADDRESSES_KEY = '@location.saved_addresses';

export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

export const DEFAULT_ADDRESS: AddressItem = {
  id: 'default-addr-1',
  label: 'Home',
  formattedAddress: '742 Market Street, San Francisco, CA 94102',
  street: '742 Market Street',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94102',
  coordinates: DEFAULT_COORDINATES,
  isDefault: true,
};

const SAMPLE_PLACES: PlacePrediction[] = [
  {
    placeId: 'place-sf-market',
    primaryText: 'Market Street',
    secondaryText: 'San Francisco, CA, USA',
    description: 'Market Street, San Francisco, CA 94102',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
  },
  {
    placeId: 'place-sf-mission',
    primaryText: 'Mission District',
    secondaryText: 'San Francisco, CA, USA',
    description: 'Mission District, San Francisco, CA 94110',
    coordinates: { latitude: 37.7599, longitude: -122.4148 },
  },
  {
    placeId: 'place-sf-soma',
    primaryText: 'SoMa / Financial District',
    secondaryText: 'San Francisco, CA, USA',
    description: 'Howard Street, San Francisco, CA 94103',
    coordinates: { latitude: 37.7858, longitude: -122.4008 },
  },
];

export const searchPlaces = async (queryText: string): Promise<PlacePrediction[]> => {
  const query = queryText.trim().toLowerCase();
  if (!query) {
    return [];
  }

  return SAMPLE_PLACES.filter(
    place =>
      place.primaryText.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query)
  );
};

export const reverseGeocode = async (coords: Coordinates): Promise<AddressItem> => {
  return {
    id: `addr-${Date.now()}`,
    label: 'Other',
    formattedAddress: `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`,
    coordinates: coords,
  };
};

export const getSelectedAddress = async (): Promise<AddressItem> => {
  const cached = getJson<AddressItem>(SELECTED_ADDRESS_KEY);
  if (cached) {
    return cached;
  }
  Storage.set(SELECTED_ADDRESS_KEY, DEFAULT_ADDRESS);
  return DEFAULT_ADDRESS;
};

export const setSelectedAddress = (address: AddressItem): boolean => {
  return Storage.set(SELECTED_ADDRESS_KEY, address);
};

export const getSavedAddresses = async (): Promise<AddressItem[]> => {
  const cached = getJson<AddressItem[]>(SAVED_ADDRESSES_KEY);
  if (cached && cached.length > 0) {
    return cached;
  }
  const defaults = [DEFAULT_ADDRESS];
  Storage.set(SAVED_ADDRESSES_KEY, defaults);
  return defaults;
};

export const saveAddress = async (address: AddressItem): Promise<AddressItem[]> => {
  const current = (await getSavedAddresses()).filter(a => a.id !== address.id);
  const updated = [address, ...current];
  Storage.set(SAVED_ADDRESSES_KEY, updated);
  return updated;
};

