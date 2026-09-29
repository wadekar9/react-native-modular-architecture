import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InstamartHomeStack from './home.stack';
import type { InstamartTabParamList } from './types';

const Tabs = createBottomTabNavigator<InstamartTabParamList>();

const VerticalNavigator = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="InstamartTab" component={InstamartHomeStack} options={{ title: 'Instamart' }} />
  </Tabs.Navigator>
);

export default VerticalNavigator;