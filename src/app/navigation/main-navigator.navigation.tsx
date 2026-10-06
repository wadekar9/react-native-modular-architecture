import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getActiveVerticals } from '@modules/registry';
import { useAppSelector } from '@core/store/hooks';
import VerticalSwitcher from './vertical-switcher.component';
import { MainTopTabBarParamsList } from '@shared/types/navigation.types';

const Tabs = createMaterialTopTabNavigator<MainTopTabBarParamsList>();

const MainNavigator = () => {
  const flags = useAppSelector(state => state.flags);
  const activeVerticals = getActiveVerticals(flags);

  return (
    <Tabs.Navigator
      tabBar={VerticalSwitcher}
      screenOptions={{
        lazy: true,
        swipeEnabled: false,
      }}
    >
      {activeVerticals.map(vertical => (
        <Tabs.Screen
          key={vertical.id}
          name={vertical.id as keyof MainTopTabBarParamsList}
          getComponent={vertical.getNavigator}
          options={{ title: vertical.title }}
        />
      ))}
    </Tabs.Navigator>
  );
};

export default MainNavigator;