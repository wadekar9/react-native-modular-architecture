import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@modules/platform';
import { FoodBottomBarParamsList } from '../types/navigation.types';
import { EFoodBottomScreens } from '../constants/screens.constants';
import { FoodHome } from '../screens';

const Tabs = createBottomTabNavigator<FoodBottomBarParamsList>();

const FoodBottomBar = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name={EFoodBottomScreens.FOOD_HOME} component={FoodHome} options={{ title: 'Food' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default FoodBottomBar;