import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  AuthStackParamsList,
  LocationStackParamsList,
  NotificationStackParamsList,
  SettingsStackParamsList,
} from '@modules/platform';
import { ERootScreens } from './root.constants';

export { ERootScreens };

export type AppStackParamsList = AuthStackParamsList &
  LocationStackParamsList &
  NotificationStackParamsList &
  SettingsStackParamsList & {
    [ERootScreens.MAIN]: undefined;
  };

export type AppStackScreenProps<T extends keyof AppStackParamsList> = NativeStackScreenProps<AppStackParamsList, T>;
export type AppStackNavigationProps = NativeStackNavigationProp<AppStackParamsList>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamsList {}
  }
}

