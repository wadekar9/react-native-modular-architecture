import type { NavigatorScreenParams } from '@react-navigation/native';

export type InstamartStackParamList = {
  InstamartHome: undefined;
};

export type InstamartTabParamList = {
  InstamartTab: NavigatorScreenParams<InstamartStackParamList>;
};