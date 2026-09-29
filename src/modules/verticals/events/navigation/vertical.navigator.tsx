import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import EventsHomeStack from './home.stack';
import type { EventsTabParamList } from './types';

const Tabs = createBottomTabNavigator<EventsTabParamList>();

const VerticalNavigator = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="EventsTab" component={EventsHomeStack} options={{ title: 'Events' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default VerticalNavigator;