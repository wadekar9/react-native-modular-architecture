import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@shared/components/navigation';
import { FoodBottomBarParamsList } from '../types/navigation.types';
import { EFoodBottomScreens } from '../constants/screens.constants';
import { FoodHome, MyOrders } from '../screens';

const Tabs = createBottomTabNavigator<FoodBottomBarParamsList>();

const FoodBottomBar = () => (
  <FreezeOnBlur>
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name={EFoodBottomScreens.FOOD_HOME} component={FoodHome} options={{ title: 'Food' }} />
      <Tabs.Screen name={EFoodBottomScreens.MY_ORDERS} component={MyOrders} options={{ title: 'My Orders' }} />
    </Tabs.Navigator>
  </FreezeOnBlur>
);

export default FoodBottomBar;