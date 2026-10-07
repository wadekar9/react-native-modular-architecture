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

export type LiveLocation = Coordinates & {
  heading?: number; // In degrees 0 - 360
  speed?: number; // In meters per second or km/h
  altitude?: number;
  timestamp: number;
};

export type TripStatus =
  | 'assigned'
  | 'picking_up'
  | 'picked_up'
  | 'on_the_way'
  | 'arriving'
  | 'completed'
  | 'cancelled';

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatarUrl?: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor?: string;
}

export interface TrackingTrip {
  tripId: string;
  orderId?: string;
  driver: DriverInfo;
  status: TripStatus;
  currentLocation: LiveLocation;
  pickupLocation: AddressItem;
  dropoffLocation: AddressItem;
  routeCoordinates: Coordinates[];
  currentRouteIndex: number;
  etaMinutes: number;
  distanceRemainingKm: number;
  updatedAt: string;
}
