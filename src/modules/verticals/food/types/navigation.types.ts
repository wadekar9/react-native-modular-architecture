import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AppStackParamsList, AppStackScreenProps } from '@shared/types/navigation.types';
import { EFoodBottomScreens, EFoodStackScreens } from '../constants/screens.constants';

export type FoodStackParamsList = {
    [EFoodStackScreens.FOOD_BOTTOM_TAB]: undefined;
    [EFoodStackScreens.RECIPE_DETAILS]: undefined;
    [EFoodStackScreens.FOOD_CART]: undefined;
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
