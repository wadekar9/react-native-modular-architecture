import axios from 'axios';
import { Storage, getJson } from '@core/storage/storage';
import type { AddressItem, Coordinates, PlacePrediction } from './types';

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
    placeId: 'place-sf-embarcadero',
    primaryText: 'The Embarcadero',
    secondaryText: 'San Francisco, CA, USA',
    description: '1 Ferry Building, The Embarcadero, San Francisco, CA 94111',
    coordinates: { latitude: 37.7955, longitude: -122.3937 },
  },
  {
    placeId: 'place-ny-manhattan',
    primaryText: 'Times Square',
    secondaryText: 'Manhattan, NY, USA',
    description: 'Broadway, Manhattan, NY 10036',
    coordinates: { latitude: 40.7580, longitude: -73.9855 },
  },
  {
    placeId: 'place-ny-brooklyn',
    primaryText: 'Brooklyn Bridge Park',
    secondaryText: 'Brooklyn, NY, USA',
    description: '334 Furman St, Brooklyn, NY 11201',
    coordinates: { latitude: 40.6992, longitude: -73.9972 },
  },
];

export const getSelectedAddress = (): AddressItem => {
  const stored = getJson<AddressItem>(SELECTED_ADDRESS_KEY);
  if (stored) {
    return stored;
  }
  Storage.set(SELECTED_ADDRESS_KEY, DEFAULT_ADDRESS);
  return DEFAULT_ADDRESS;
};

export const setSelectedAddress = (address: AddressItem): void => {
  Storage.set(SELECTED_ADDRESS_KEY, address);
};

export const getSavedAddresses = (): AddressItem[] => {
  const stored = getJson<AddressItem[]>(SAVED_ADDRESSES_KEY);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  const defaults: AddressItem[] = [
    DEFAULT_ADDRESS,
    {
      id: 'default-addr-2',
      label: 'Work',
      formattedAddress: '500 Howard Street, San Francisco, CA 94105',
      street: '500 Howard Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      coordinates: { latitude: 37.7885, longitude: -122.3985 },
      isDefault: false,
    },
  ];
  Storage.set(SAVED_ADDRESSES_KEY, defaults);
  return defaults;
};

export const saveAddress = (address: AddressItem): AddressItem[] => {
  const current = getSavedAddresses();
  const filtered = current.filter(item => item.id !== address.id);
  const updated = [address, ...filtered];
  Storage.set(SAVED_ADDRESSES_KEY, updated);
  return updated;
};

export const reverseGeocode = async (
  coordinates: Coordinates,
  apiKey?: string,
): Promise<AddressItem> => {
  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`;
      const response = await axios.get(url);
      if (response.data?.results?.[0]) {
        const result = response.data.results[0];
        return {
          id: `addr-${Date.now()}`,
          label: 'Other',
          formattedAddress: result.formatted_address,
          coordinates,
        };
      }
    } catch {
      // Fallback on network or API failure
    }
  }

  // Graceful fallback: synthesize a clean street address from coordinates
  const latStr = coordinates.latitude.toFixed(4);
  const lngStr = coordinates.longitude.toFixed(4);
  return {
    id: `addr-${Date.now()}`,
    label: 'Other',
    formattedAddress: `Near ${latStr}, ${lngStr} • San Francisco, CA`,
    street: `Location at ${latStr}, ${lngStr}`,
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    coordinates,
  };
};

export const searchPlaces = async (
  queryText: string,
  apiKey?: string,
): Promise<PlacePrediction[]> => {
  const trimmed = queryText.trim().toLowerCase();
  if (!trimmed) {
    return SAMPLE_PLACES;
  }

  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(queryText)}&types=geocode&key=${apiKey}`;
      const response = await axios.get(url);
      if (response.data?.predictions?.length) {
        return response.data.predictions.map((p: any) => ({
          placeId: p.place_id,
          primaryText: p.structured_formatting?.main_text ?? p.description,
          secondaryText: p.structured_formatting?.secondary_text ?? '',
          description: p.description,
        }));
      }
    } catch {
      // Fall back to local search
    }
  }

  // Local filter matching query
  const matches = SAMPLE_PLACES.filter(
    item =>
      item.primaryText.toLowerCase().includes(trimmed) ||
      item.secondaryText.toLowerCase().includes(trimmed) ||
      item.description.toLowerCase().includes(trimmed),
  );

  if (matches.length > 0) {
    return matches;
  }

  // If no static match, create a custom prediction for the user's search query
  return [
    {
      placeId: `custom-place-${Date.now()}`,
      primaryText: queryText,
      secondaryText: 'San Francisco, CA, USA',
      description: `${queryText}, San Francisco, CA`,
      coordinates: {
        latitude: DEFAULT_COORDINATES.latitude + (Math.random() - 0.5) * 0.02,
        longitude: DEFAULT_COORDINATES.longitude + (Math.random() - 0.5) * 0.02,
      },
    },
    ...SAMPLE_PLACES,
  ];
};
