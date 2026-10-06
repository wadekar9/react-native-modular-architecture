import type { LinkingOptions } from '@react-navigation/native';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';
import { getVerticalDeepLinks } from '@modules/registry';

/**
 * Deep linking configuration for the application.
 * Dynamically aggregates deep link trees from active vertical manifests.
 */
export const linking: LinkingOptions<AppStackParamsList> = {
    prefixes: ['super://app'],
    config: {
        screens: {
            [EStackScreens.LOGIN]: 'login',
            [EStackScreens.MAIN]: {
                screens: getVerticalDeepLinks(),
            },
        },
    },
};
