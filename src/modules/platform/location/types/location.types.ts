export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type MapRegion = Coordinates & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type AddressItem = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  formattedAddress: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  coordinates: Coordinates;
  isDefault?: boolean;
};

export type PlacePrediction = {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  description: string;
  coordinates?: Coordinates;
};
