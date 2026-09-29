import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import InstamartHomeStack from './home.stack';
import type { InstamartTabParamList } from './types';

const Tabs = createBottomTabNavigator<InstamartTabParamList>();

const VerticalNavigator = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="InstamartTab" component={InstamartHomeStack} options={{ title: 'Instamart' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default VerticalNavigator;