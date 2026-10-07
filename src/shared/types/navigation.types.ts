import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabNavigationProp, MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { EBottomScreens, EStackScreens } from '@shared/constants/screens.constants';

export type AppStackParamsList = {
    [EStackScreens.SPLASH]: undefined;
    [EStackScreens.LOGIN]: undefined;
    [EStackScreens.REGISTER]: undefined;
    [EStackScreens.FORGOT_PASSWORD]: undefined;
    [EStackScreens.OTP_VERIFICATION]: { email?: string } | undefined;
    [EStackScreens.RESET_PASSWORD]: { email?: string; otp?: string } | undefined;
    [EStackScreens.NOTIFICATIONS]: undefined;
    [EStackScreens.LIVE_TRACKING]: { tripId?: string } | undefined;
    [EStackScreens.MAIN]: undefined;
}

export type MainTopTabBarParamsList = Record<string, undefined>;

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
