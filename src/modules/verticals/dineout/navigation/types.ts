import type { NavigatorScreenParams } from '@react-navigation/native';

export type DineoutStackParamList = {
  DineoutHome: undefined;
};

export type DineoutTabParamList = {
  DineoutTab: NavigatorScreenParams<DineoutStackParamList>;
};