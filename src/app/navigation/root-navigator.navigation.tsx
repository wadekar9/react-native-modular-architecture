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
import { getPlatformScreens, EAuthScreens } from '@modules/platform';
import { ERootScreens, type AppStackParamsList } from './navigation.types';

const RootStack = createNativeStackNavigator<AppStackParamsList>();
const platformScreens = getPlatformScreens();

const RootNavigator = () => {
    const navigationTheme = useNavigationTheme();
    const isSignedIn = useAppSelector(state => state.session.isSignedIn);

    const wasSignedInRef = React.useRef(isSignedIn);
    useEffect(() => {
        if (wasSignedInRef.current && !isSignedIn) {
            runLogoutHooks();
            queryClient.clear();
            if (navigationRef.isReady()) {
                navigationRef.reset({ index: 0, routes: [{ name: EAuthScreens.LOGIN }] });
            }
        } else if (!wasSignedInRef.current && isSignedIn) {
            if (navigationRef.isReady()) {
                navigationRef.reset({ index: 0, routes: [{ name: ERootScreens.MAIN }] });
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
                initialRouteName={EAuthScreens.SPLASH}
                screenOptions={{ headerShown: false, animation: 'fade' }}
            >
                {platformScreens.map(screen => (
                    <RootStack.Screen
                        key={screen.name}
                        name={screen.name as keyof AppStackParamsList}
                        getComponent={screen.getComponent}
                        options={screen.options}
                    />
                ))}

                <RootStack.Screen name={ERootScreens.MAIN} component={MainNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
