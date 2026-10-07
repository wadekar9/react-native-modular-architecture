import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AppStackParamsList, AppStackScreenProps } from '@shared/types/navigation.types';
import { EFoodBottomScreens, EFoodStackScreens } from '../constants/screens.constants';

export type FoodStackParamsList = {
    [EFoodStackScreens.FOOD_BOTTOM_TAB]: NavigatorScreenParams<FoodBottomBarParamsList> | undefined;
    [EFoodStackScreens.RECIPE_DETAILS]: undefined;
    [EFoodStackScreens.FOOD_CART]: undefined;
    [EFoodStackScreens.FOOD_SEARCH]: undefined;
    [EFoodStackScreens.FOOD_PAYMENT]: undefined;
    [EFoodStackScreens.ORDER_CONFIRMATION]: { orderId: string };
    [EFoodStackScreens.ORDER_DETAILS]: { orderId: string };
};

export type FoodBottomBarParamsList = {
    [EFoodBottomScreens.FOOD_HOME]: undefined;
    [EFoodBottomScreens.MY_ORDERS]: undefined;
};

export type FoodStackScreenProps<T extends keyof FoodStackParamsList> = CompositeScreenProps<
    NativeStackScreenProps<FoodStackParamsList, T>,
    AppStackScreenProps<keyof AppStackParamsList>
>;
export type FoodStackNavigationProps = NativeStackNavigationProp<FoodStackParamsList>;

export type FoodBottomBarScreenProps<T extends keyof FoodBottomBarParamsList> = CompositeScreenProps<
    BottomTabScreenProps<FoodBottomBarParamsList, T>,
    FoodStackScreenProps<keyof FoodStackParamsList>
>;
export type FoodBottomBarNavigationProps = BottomTabNavigationProp<FoodBottomBarParamsList>;
