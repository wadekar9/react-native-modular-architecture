import type { NavigatorScreenParams } from '@react-navigation/native';

export type EventsStackParamList = {
  EventsHome: undefined;
};

export type EventsTabParamList = {
  EventsTab: NavigatorScreenParams<EventsStackParamList>;
};