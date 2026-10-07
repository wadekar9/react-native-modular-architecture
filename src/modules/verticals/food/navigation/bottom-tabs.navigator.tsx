import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@shared/components/navigation';
import { FoodBottomBarParamsList } from '../types/navigation.types';
import { EFoodBottomScreens } from '../constants/screens.constants';
import { FoodHome, MyOrders } from '../screens';
import { useAppTranslation } from '@core/i18n';

const Tabs = createBottomTabNavigator<FoodBottomBarParamsList>();

const FoodBottomBar = () => {
  const { common_t } = useAppTranslation();

  return (
    <FreezeOnBlur>
      <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen name={EFoodBottomScreens.FOOD_HOME} component={FoodHome} options={{ title: common_t('FOOD') }} />
        <Tabs.Screen name={EFoodBottomScreens.MY_ORDERS} component={MyOrders} options={{ title: common_t('MY_ORDERS') }} />
      </Tabs.Navigator>
    </FreezeOnBlur>
  );
};

export default FoodBottomBar;