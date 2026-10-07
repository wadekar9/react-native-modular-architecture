import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getActiveVerticals } from '@modules/registry';
import { useAppSelector } from '@core/store/hooks';
import VerticalSwitcher from './vertical-switcher.component';
import { MainTopTabBarParamsList } from '@shared/types/navigation.types';

/**
 * ============================================================================
 * MAIN NAVIGATOR (DYNAMIC VERTICAL SHELL)
 * ============================================================================
 *
 * This navigator is the core container that hosts all active business verticals.
 *
 * HOW DYNAMIC MOUNTING WORKS INTERNALLY:
 *
 * 1. REACTIVE TO FEATURE FLAGS:
 *    `MainNavigator` subscribes to Redux feature flags via `useAppSelector(state => state.flags)`.
 *    Whenever flags update (e.g. from Remote Config), this component re-renders.
 *
 * 2. REGISTRY-DRIVEN SCREEN GENERATION:
 *    Instead of hardcoding screens like `<Tabs.Screen name="Food" component={FoodStack} />`,
 *    it calls `getActiveVerticals(flags)`. This filters active verticals and triggers
 *    their `onRegister()` hooks (injecting Redux slices).
 *
 * 3. LAZY EVALUATION (`getComponent`):
 *    Using `getComponent={vertical.getNavigator}` ensures that the screen component
 *    is only retrieved and mounted when the user actually switches to that tab.
 *    Initial app startup evaluates ZERO screens from inactive or unopened verticals.
 *
 * 4. DYNAMIC TAB SWITCHER:
 *    Uses `VerticalSwitcher` as the custom tab bar, which dynamically reads route names
 *    and titles from the active manifests.
 */

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