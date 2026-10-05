import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import {
  AccountDetails,
  AddressSearch,
  LocationPicker,
  Login,
  Notifications,
  Payment,
  Profile,
  Settings,
  usePushNotifications,
} from '@modules/platform';
import { runLogoutHooks } from '@modules/registry';
import { queryClient } from '@core/networking/query-client';
import { linking } from './linking';
import MainNavigator from './main-navigator.navigation';
import { useNavigationTheme } from '@shared/hooks';
import { navigationRef } from '@core/navigation';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';

const RootStack = createNativeStackNavigator<AppStackParamsList>();

const RootNavigator = () => {
    const navigationTheme = useNavigationTheme();
    const isSignedIn = useAppSelector(state => state.session.isSignedIn);

    usePushNotifications();

    const wasSignedInRef = React.useRef(isSignedIn);
    useEffect(() => {
        if (wasSignedInRef.current && !isSignedIn) {
            runLogoutHooks();
            queryClient.clear();
        }
        wasSignedInRef.current = isSignedIn;
    }, [isSignedIn]);

    useEffect(() => {
        const hideSplash = async () => {
            try {
                if (BootSplash.isVisible()) {
                    await BootSplash.hide({ fade: true });
                }
            } catch {}
        };

        hideSplash();
    }, []);

    return (
        <NavigationContainer<AppStackParamsList> ref={navigationRef} theme={navigationTheme} linking={linking}>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                {isSignedIn ? (
                    <>
                        <RootStack.Screen name={EStackScreens.MAIN} component={MainNavigator} />
                        <RootStack.Screen name={EStackScreens.PROFILE} component={Profile} />
                        <RootStack.Screen name={EStackScreens.ACCOUNT_DETAILS} component={AccountDetails} />
                        <RootStack.Screen name={EStackScreens.NOTIFICATIONS} component={Notifications} />
                        <RootStack.Screen name={EStackScreens.SETTINGS} component={Settings} />
                        <RootStack.Screen name={EStackScreens.PAYMENT} component={Payment} />
                        <RootStack.Screen name={EStackScreens.LOCATION_PICKER} component={LocationPicker} />
                        <RootStack.Screen name={EStackScreens.ADDRESS_SEARCH} component={AddressSearch} />
                    </>
                ) : (
                    <RootStack.Screen name={EStackScreens.LOGIN} component={Login} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
