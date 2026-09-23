import React, { useEffect } from 'react';
import { ThemedView, ThemeText } from '$components/ui';
import { AppStackScreenProps } from '$navigation/navigation.types';
import { EStackScreens } from '$constants/screen.constants';
import { useAuthenticationFlow } from '$modules/auth/hooks/authentication-flow.hook';

const Splash: React.FC<AppStackScreenProps<EStackScreens.SPLASH>> = () => {
    const { handleAuthentication } = useAuthenticationFlow();

    useEffect(() => {
        void handleAuthentication();
    }, [handleAuthentication]);

    return (
        <ThemedView>
            <ThemeText>Splash</ThemeText>
        </ThemedView>
    );
};

export default Splash;
