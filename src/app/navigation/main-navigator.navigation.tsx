import React from 'react';
import { ParamListBase } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getActiveVerticals } from '@modules/registry';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import VerticalSwitcher from './vertical-switcher.component';

const Tabs = createMaterialTopTabNavigator<ParamListBase>();

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
          name={vertical.id}
          getComponent={vertical.getNavigator}
          options={{ title: vertical.title }}
        />
      ))}
    </Tabs.Navigator>
  );
};

export default MainNavigator;