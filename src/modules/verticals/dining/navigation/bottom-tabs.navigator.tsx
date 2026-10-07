import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FreezeOnBlur } from '@shared/components/navigation';
import { Events, Explore } from '../screens';
import { DiningBottomBarParamsList } from '../types/navigation.types';
import { EDiningBottomScreens } from '../constants/screens.constants';
import { useAppTranslation } from '@core/i18n';

const Tabs = createBottomTabNavigator<DiningBottomBarParamsList>();

const DiningBottomTabs = () => {
  const { common_t } = useAppTranslation();

  return (
    <FreezeOnBlur>
      <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen name={EDiningBottomScreens.EVENTS} component={Events} options={{ title: common_t('EVENTS') }} />
        <Tabs.Screen name={EDiningBottomScreens.EXPLORE} component={Explore} options={{ title: common_t('EXPLORE') }} />
      </Tabs.Navigator>
    </FreezeOnBlur>
  );
};

export default DiningBottomTabs;
