import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { useAppSelector } from '@core/store/hooks';
import { runLogoutHooks } from '@modules/registry';
import { queryClient } from '@core/networking/query-client';
import { linking } from './linking';
import MainNavigator from './main-navigator.navigation';
import { useNavigationTheme } from '@shared/hooks';
import { navigationRef } from '@core/navigation';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';
import Routes from '@modules/platform/routes';

const RootStack = createNativeStackNavigator<AppStackParamsList>();

const RootNavigator = () => {
    const navigationTheme = useNavigationTheme();
    const isSignedIn = useAppSelector(state => state.session.isSignedIn);

    const wasSignedInRef = React.useRef(isSignedIn);
    useEffect(() => {
        if (wasSignedInRef.current && !isSignedIn) {
            runLogoutHooks();
            queryClient.clear();
            if (navigationRef.isReady()) {
                navigationRef.reset({ index: 0, routes: [{ name: EStackScreens.LOGIN }] });
            }
        } else if (!wasSignedInRef.current && isSignedIn) {
            if (navigationRef.isReady()) {
                navigationRef.reset({ index: 0, routes: [{ name: EStackScreens.MAIN }] });
            }
        }
        wasSignedInRef.current = isSignedIn;
    }, [isSignedIn]);

    useEffect(() => {
        (async () => {
            if (BootSplash.isVisible()) {
                await BootSplash.hide({ fade: true });
            }
        })();
    }, []);

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={navigationTheme}
            linking={linking}
        >
            <RootStack.Navigator
                initialRouteName={EStackScreens.SPLASH}
                screenOptions={{ headerShown: false, animation: 'fade' }}
            >
                <RootStack.Screen name={EStackScreens.SPLASH} component={Routes.Splash} />
                <RootStack.Screen name={EStackScreens.LOGIN} component={Routes.Login} />
                <RootStack.Screen name={EStackScreens.REGISTER} component={Routes.Register} />
                <RootStack.Screen name={EStackScreens.FORGOT_PASSWORD} component={Routes.ForgotPassword} />
                <RootStack.Screen name={EStackScreens.RESET_PASSWORD} component={Routes.ResetPassword} />
                <RootStack.Screen name={EStackScreens.OTP_VERIFICATION} component={Routes.OtpVerification} />
                <RootStack.Screen name={EStackScreens.NOTIFICATIONS} component={Routes.NotificationList} />
                <RootStack.Screen name={EStackScreens.LIVE_TRACKING} component={Routes.LiveTracking} />
                <RootStack.Screen name={EStackScreens.SETTINGS} component={Routes.Settings} />
                <RootStack.Screen name={EStackScreens.EDIT_PROFILE} component={Routes.EditProfile} />

                <RootStack.Screen name={EStackScreens.MAIN} component={MainNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
