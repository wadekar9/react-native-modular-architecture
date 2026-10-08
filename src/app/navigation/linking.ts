import type { LinkingOptions } from '@react-navigation/native';
import { EAuthScreens } from '@modules/platform';
import { ERootScreens } from './root.constants';
import type { AppStackParamsList } from './navigation.types';
import { getVerticalDeepLinks } from '@modules/registry';

/**
 * Deep linking configuration for the application.
 * Dynamically aggregates deep link trees from active vertical manifests.
 */
export const linking: LinkingOptions<AppStackParamsList> = {
    prefixes: ['super://app'],
    config: {
        screens: {
            [EAuthScreens.LOGIN]: 'login',
            [ERootScreens.MAIN]: {
                screens: getVerticalDeepLinks(),
            },
        },
    },
};
