import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsHomeScreen from '../screens/home';
import type { EventsStackParamList } from './types';

const Stack = createNativeStackNavigator<EventsStackParamList>();

const EventsHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EventsHome" component={EventsHomeScreen} />
  </Stack.Navigator>
);

export default EventsHomeStack;