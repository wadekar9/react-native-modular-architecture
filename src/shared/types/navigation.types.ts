import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MaterialTopTabNavigationProp, MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

export type MainTopTabBarParamsList = Record<string, undefined>;
export type MainTopTabBarScreenProps<T extends keyof MainTopTabBarParamsList = string> = MaterialTopTabScreenProps<MainTopTabBarParamsList, T>;
export type MainTopTabBarNavigationProps = MaterialTopTabNavigationProp<MainTopTabBarParamsList>;

export type GenericBottomBarParamsList = Record<string, undefined>;
export type GenericBottomBarScreenProps<T extends keyof GenericBottomBarParamsList = string> = BottomTabScreenProps<GenericBottomBarParamsList, T>;
export type GenericBottomBarNavigationProps = BottomTabNavigationProp<GenericBottomBarParamsList>;
