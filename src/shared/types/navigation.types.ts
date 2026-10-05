import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabNavigationProp, MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { EBottomScreens, EStackScreens, ETopScreens } from '@shared/constants/screens.constants';

export type AppStackParamsList = {
    [EStackScreens.PROFILE]: undefined;
    [EStackScreens.ACCOUNT_DETAILS]: undefined;
    [EStackScreens.NOTIFICATIONS]: undefined;
    [EStackScreens.SETTINGS]: undefined;
    [EStackScreens.PAYMENT]: undefined;
    [EStackScreens.SPLASH]: undefined;
    [EStackScreens.LOGIN]: undefined;
    [EStackScreens.MAIN]: undefined;
    [EStackScreens.LOCATION_PICKER]: undefined;
    [EStackScreens.ADDRESS_SEARCH]: undefined;
}

export type MainTopTabBarParamsList = {
    [ETopScreens.FOOD]: undefined;
    [ETopScreens.DINING]: undefined;
}

export type BottomBarParamsList = {
    [EBottomScreens.HOME]: undefined;
}

export type BottomBarScreenProps<T extends keyof BottomBarParamsList> = BottomTabScreenProps<BottomBarParamsList, T>;
export type BottomBarNavigationProps = BottomTabNavigationProp<BottomBarParamsList>;

export type MainTopTabBarScreenProps<T extends keyof MainTopTabBarParamsList> = MaterialTopTabScreenProps<MainTopTabBarParamsList, T>;
export type MainTopTabBarNavigationProps = MaterialTopTabNavigationProp<MainTopTabBarParamsList>;

export type AppStackScreenProps<T extends keyof AppStackParamsList> = NativeStackScreenProps<AppStackParamsList, T>;
export type AppStackNavigationProps = NativeStackNavigationProp<AppStackParamsList>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends AppStackParamsList {}
    }
}
