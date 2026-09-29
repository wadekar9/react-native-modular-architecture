import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import FoodHomeStack from './home.stack';
import type { FoodTabParamList } from './types';

const Tabs = createBottomTabNavigator<FoodTabParamList>();

const VerticalNavigator = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="FoodTab" component={FoodHomeStack} options={{ title: 'Food' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default VerticalNavigator;