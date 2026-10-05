import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import { Events, Explore } from '../screens';
import { DiningBottomBarParamsList } from '../types/navigation.types';
import { EDiningBottomScreens } from '../constants/screens.constants';

const Tabs = createBottomTabNavigator<DiningBottomBarParamsList>();

const DiningBottomTabs = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name={EDiningBottomScreens.EVENTS} component={Events} />
      <Tabs.Screen name={EDiningBottomScreens.EXPLORE} component={Explore} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default DiningBottomTabs;


