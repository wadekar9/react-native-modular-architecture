import type { LinkingOptions } from '@react-navigation/native';
import { EStackScreens, ETopScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';

/**
 * Deep linking configuration for the application.
 */
export const linking: LinkingOptions<AppStackParamsList> = {
    prefixes: ['awesome://app'],
    config: {
        screens: {
            [EStackScreens.LOGIN]: 'login',
            [EStackScreens.MAIN]: {
                screens: {
                    [ETopScreens.FOOD]: {
                        screens: {
                            RecipeDetails: 'food/recipe/:id',
                            FoodCart: 'food/cart',
                        },
                    },
                    [ETopScreens.DINING]: {
                        screens: {
                            EventDetails: 'dining/event/:id',
                        },
                    },
                },
            },
            [EStackScreens.PROFILE]: 'profile',
            [EStackScreens.ACCOUNT_DETAILS]: 'account-details',
            [EStackScreens.NOTIFICATIONS]: 'notifications',
            [EStackScreens.SETTINGS]: 'settings',
            [EStackScreens.PAYMENT]: 'payment',
            [EStackScreens.LOCATION_PICKER]: 'location-picker',
            [EStackScreens.ADDRESS_SEARCH]: 'address-search',
        },
    },
};
