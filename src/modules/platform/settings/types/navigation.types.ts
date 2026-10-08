import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ESettingsScreens } from '../constants/screens.constants';

export type SettingsStackParamsList = {
  [ESettingsScreens.SETTINGS]: undefined;
  [ESettingsScreens.EDIT_PROFILE]: undefined;
};

export type SettingsScreenProps<T extends keyof SettingsStackParamsList> = NativeStackScreenProps<SettingsStackParamsList, T>;
export type SettingsNavigationProps = NativeStackNavigationProp<SettingsStackParamsList>;

