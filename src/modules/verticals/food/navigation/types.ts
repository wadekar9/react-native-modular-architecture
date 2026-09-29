import type { NavigatorScreenParams } from '@react-navigation/native';

export type FoodStackParamList = {
  FoodHome: undefined;
};

export type FoodTabParamList = {
  FoodTab: NavigatorScreenParams<FoodStackParamList>;
};