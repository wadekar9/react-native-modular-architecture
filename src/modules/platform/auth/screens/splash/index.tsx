import React, { useEffect } from 'react';
import { ThemedView, ThemeText } from '$components/ui';
import { useAuthenticationFlow } from '@modules/platform/auth/hooks/authentication-flow.hook';

const Splash: React.FC = () => {
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
