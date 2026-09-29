import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FoodHomeStack from './home.stack';
import type { FoodTabParamList } from './types';

const Tabs = createBottomTabNavigator<FoodTabParamList>();

const VerticalNavigator = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="FoodTab" component={FoodHomeStack} options={{ title: 'Food' }} />
  </Tabs.Navigator>
);

export default VerticalNavigator;