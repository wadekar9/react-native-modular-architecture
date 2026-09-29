import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsHomeStack from './home.stack';
import type { EventsTabParamList } from './types';

const Tabs = createBottomTabNavigator<EventsTabParamList>();

const VerticalNavigator = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="EventsTab" component={EventsHomeStack} options={{ title: 'Events' }} />
  </Tabs.Navigator>
);

export default VerticalNavigator;