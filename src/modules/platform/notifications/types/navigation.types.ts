import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ENotificationScreens } from '../constants/screens.constants';

export type NotificationStackParamsList = {
  [ENotificationScreens.NOTIFICATIONS]: undefined;
};

export type NotificationScreenProps<T extends keyof NotificationStackParamsList> = NativeStackScreenProps<NotificationStackParamsList, T>;
export type NotificationNavigationProps = NativeStackNavigationProp<NotificationStackParamsList>;

