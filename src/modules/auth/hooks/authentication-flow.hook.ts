import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { EStackScreens } from "$constants/screen.constants";
import { Storage } from '$core/storage/storage';
import { EStorageKeys } from '$constants/storage.constants';

/**
 * Custom hook to manage the initial authentication flow.
 * Handles token validation, profile fetching, and initial navigation.
 */
export const useAuthenticationFlow = () => {
    const navigation = useNavigation<any>();

    /**
     * Hides the splash screen if it's currently visible.
     */
    const hideSplashScreen = useCallback(async () => {
        try {
            const isVisible = await BootSplash.isVisible();
            if (isVisible) {
                await BootSplash.hide({ fade: true });
            }
        } catch (error) {
            console.warn('BootSplash hide error:', error);
        }
    }, []);

    /**
     * Navigates to the login screen and ensures the splash screen is hidden.
     */
    const navigateToLogin = useCallback(() => {
        navigation.replace(EStackScreens.LOGIN);
        hideSplashScreen();
    }, [navigation, hideSplashScreen]);

    /**
     * Main handler for determining initial application state based on authentication.
     */
    const handleAuthentication = useCallback(async () => {
        try {
            const token = Storage.getString(EStorageKeys.ACCESS_TOKEN);

            if (!token) {
                navigateToLogin();
                return;
            }

            navigation.replace(EStackScreens.BOTTOM_TAB_NAVIGATOR);
            await hideSplashScreen();
        } catch (error) {
            console.error('Authentication flow error:', error);
            navigateToLogin();
        }
    }, [navigateToLogin, hideSplashScreen, navigation]);

    return { handleAuthentication };
};
