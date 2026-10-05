import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamsList, AppStackScreenProps } from '@shared/types/navigation.types';
import { EDiningBottomScreens, EDiningStackScreens } from '../constants/screens.constants';

export type DiningStackParamsList = {
    [EDiningStackScreens.DINING_BOTTOM_NAV]: undefined;
    [EDiningStackScreens.EVENT_DETAILS]: undefined;
};

export type DiningBottomBarParamsList = {
    [EDiningBottomScreens.EXPLORE]: undefined;
    [EDiningBottomScreens.EVENTS]: undefined;
};

export type DiningStackScreenProps<T extends keyof DiningStackParamsList> = CompositeScreenProps<
    NativeStackScreenProps<DiningStackParamsList, T>,
    AppStackScreenProps<keyof AppStackParamsList>
>;
export type DiningStackNavigationProps = NativeStackNavigationProp<DiningStackParamsList>;

export type DiningBottomBarScreenProps<T extends keyof DiningBottomBarParamsList> = CompositeScreenProps<
    BottomTabScreenProps<DiningBottomBarParamsList, T>,
    DiningStackScreenProps<keyof DiningStackParamsList>
>;
export type DiningBottomBarNavigationProps = BottomTabNavigationProp<DiningBottomBarParamsList>;
