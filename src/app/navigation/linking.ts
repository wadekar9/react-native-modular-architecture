import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './navigation.types';

/**
 * Deep linking configuration for the application.
 */
export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['awesome://app'], // Replace with actual scheme
    config: {
        screens: {
            Login: 'login',
            Main: {
                screens: {
                    food: 'food',
                    instamart: 'instamart',
                    dineout: 'dineout',
                    events: 'events',
                },
            },
            Profile: 'profile',
            Payment: 'payment',
        },
    },
};
