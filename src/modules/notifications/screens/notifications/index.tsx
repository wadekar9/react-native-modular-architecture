import React from 'react';
import { Text } from 'react-native';
import { ThemedView, ThemeText } from '$components/ui';
import { AppStackScreenProps } from '$navigation/navigation.types';
import { EStackScreens } from '$constants/screen.constants';

const Notifications: React.FC<AppStackScreenProps<EStackScreens.NOTIFICATIONS>> = () => {

    return (
        <ThemedView>
            <ThemeText>Notifications</ThemeText>
        </ThemedView>
    );
};

export default Notifications;
