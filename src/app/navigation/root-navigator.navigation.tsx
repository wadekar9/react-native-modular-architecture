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
import { useNavigationTheme } from './hooks/navigation-theme.hook';
import { rootNavigationRef } from './navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const ProfileRoute = () => <Profile onLogout={logout} />;

const RootNavigator = () => {
    const navigationTheme = useNavigationTheme();
    const isSignedIn = useAppSelector(state => state.session.isSignedIn);

    useEffect(() => {
        const hideSplash = async () => {
            try {
                if (await BootSplash.isVisible()) {
                    await BootSplash.hide({ fade: true });
                }
            } catch {}
        };

        hideSplash();
    }, []);

    return (
        <NavigationContainer ref={rootNavigationRef} theme={navigationTheme} linking={linking}>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                {isSignedIn ? (
                    <>
                        <RootStack.Screen name="Main" component={MainNavigator} />
                        <RootStack.Screen name="Profile" component={ProfileRoute} />
                        <RootStack.Screen name="AccountDetails" component={AccountDetails} />
                        <RootStack.Screen name="Notifications" component={Notifications} />
                        <RootStack.Screen name="Settings" component={Settings} />
                        <RootStack.Screen name="Payment" component={Payment} />
                    </>
                ) : (
                    <RootStack.Screen name="Login" component={Login} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
