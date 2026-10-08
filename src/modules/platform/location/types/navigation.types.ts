import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ELocationScreens } from '../constants/screens.constants';

export type LocationStackParamsList = {
  [ELocationScreens.LIVE_TRACKING]: { tripId?: string } | undefined;
};

export type LiveTrackingScreenProps = NativeStackScreenProps<
  LocationStackParamsList,
  ELocationScreens.LIVE_TRACKING
>;
export type LocationNavigationProps = NativeStackNavigationProp<LocationStackParamsList>;

