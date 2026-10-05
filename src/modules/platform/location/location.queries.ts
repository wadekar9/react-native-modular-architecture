import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSavedAddresses,
  getSelectedAddress,
  reverseGeocode,
  saveAddress,
  searchPlaces,
  setSelectedAddress,
} from './services/geocoding.service';
import type { AddressItem, Coordinates } from './types/location.types';

export const locationKeys = {
  selectedAddress: ['platform', 'location', 'selected'] as const,
  savedAddresses: ['platform', 'location', 'saved'] as const,
  search: (query: string) => ['platform', 'location', 'search', query] as const,
};

export const useSelectedAddress = () =>
  useQuery({
    queryKey: locationKeys.selectedAddress,
    queryFn: getSelectedAddress,
  });

export const useSetSelectedAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: AddressItem) => {
      setSelectedAddress(address);
      return address;
    },
    onSuccess: (address) => {
      queryClient.setQueryData(locationKeys.selectedAddress, address);
      queryClient.invalidateQueries({ queryKey: locationKeys.savedAddresses });
    },
  });
};

export const useSavedAddresses = () =>
  useQuery({
    queryKey: locationKeys.savedAddresses,
    queryFn: getSavedAddresses,
  });

export const useSaveAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: AddressItem) => {
      return saveAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.savedAddresses });
    },
  });
};

export const useSearchPlaces = (queryText: string) =>
  useQuery({
    queryKey: locationKeys.search(queryText),
    queryFn: () => searchPlaces(queryText),
    staleTime: 1000 * 60 * 2,
  });

export const useReverseGeocode = () =>
  useMutation({
    mutationFn: (coords: Coordinates) => reverseGeocode(coords),
  });
