import { Storage, getJson } from '@core/storage/storage';
import type { AddressItem, Coordinates, PlacePrediction } from '../types/location.types';

const SELECTED_ADDRESS_KEY = '@location.selected_address';
const SAVED_ADDRESSES_KEY = '@location.saved_addresses';

export const searchPlaces = async (queryText: string): Promise<PlacePrediction[]> => {
  const query = queryText.trim().toLowerCase();
  if (!query) {
    return [];
  }

  // Real places search endpoint or provider integration
  return [];
};

export const reverseGeocode = async (coords: Coordinates): Promise<AddressItem> => {
  return {
    id: `addr-${Date.now()}`,
    label: 'Other',
    formattedAddress: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
    coordinates: coords,
  };
};

export const getSelectedAddress = async (): Promise<AddressItem | null> => {
  const cached = getJson<AddressItem>(SELECTED_ADDRESS_KEY);
  return cached ?? null;
};

export const setSelectedAddress = (address: AddressItem): boolean => {
  return Storage.set(SELECTED_ADDRESS_KEY, address);
};

export const getSavedAddresses = async (): Promise<AddressItem[]> => {
  const cached = getJson<AddressItem[]>(SAVED_ADDRESSES_KEY);
  return cached && Array.isArray(cached) ? cached : [];
};

export const saveAddress = async (address: AddressItem): Promise<AddressItem[]> => {
  const current = (await getSavedAddresses()).filter(a => a.id !== address.id);
  const updated = [address, ...current];
  Storage.set(SAVED_ADDRESSES_KEY, updated);
  return updated;
};
