import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { AccountDetails, Login, Notifications, Payment, Profile, Settings } from '@modules/platform';
import { logout } from '@app/auth/logout';
import type { RootStackParamList } from './navigation.types';
import { linking } from './linking';
import MainNavigator from './main-navigator.navigation';
import { useNavigationTheme } from '@shared/hooks';
import { usePushNotifications } from '@core/notifications';
import { navigationRef } from '@core/navigation';
import { StackScreens } from '@shared/constants/screens.constants';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const ProfileRoute = () => <Profile onLogout={logout} />;

const RootNavigator = () => {
    const navigationTheme = useNavigationTheme();
    const isSignedIn = useAppSelector(state => state.session.isSignedIn);

    usePushNotifications();

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
        <NavigationContainer ref={navigationRef} theme={navigationTheme} linking={linking}>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                {isSignedIn ? (
                    <>
                        <RootStack.Screen name={StackScreens.MAIN} component={MainNavigator} />
                        <RootStack.Screen name={StackScreens.PROFILE} component={ProfileRoute} />
                        <RootStack.Screen name={StackScreens.ACCOUNT_DETAILS} component={AccountDetails} />
                        <RootStack.Screen name={StackScreens.NOTIFICATIONS} component={Notifications} />
                        <RootStack.Screen name={StackScreens.SETTINGS} component={Settings} />
                        <RootStack.Screen name={StackScreens.PAYMENT} component={Payment} />
                    </>
                ) : (
                    <RootStack.Screen name={StackScreens.LOGIN} component={Login} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
