import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiningBottomTabs from './bottom-tabs.navigator';
import { EDiningStackScreens } from '../constants/screens.constants';
import { DiningStackParamsList } from '../types/navigation.types';
import { BookingConfirmation, EventBooking, EventDetails } from '../screens';

const Stack = createNativeStackNavigator<DiningStackParamsList>();

const DiningStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={EDiningStackScreens.DINING_BOTTOM_NAV} component={DiningBottomTabs} />
    <Stack.Screen name={EDiningStackScreens.EVENT_DETAILS} component={EventDetails} />
    <Stack.Screen name={EDiningStackScreens.EVENT_BOOKING} component={EventBooking} />
    <Stack.Screen name={EDiningStackScreens.BOOKING_CONFIRMATION} component={BookingConfirmation} />
  </Stack.Navigator>
);

export default DiningStack;
