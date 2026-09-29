import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import DineoutHomeStack from './home.stack';
import type { DineoutTabParamList } from './types';

const Tabs = createBottomTabNavigator<DineoutTabParamList>();

const VerticalNavigator = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="DineoutTab" component={DineoutHomeStack} options={{ title: 'Dineout' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default VerticalNavigator;