import { EDiningStackScreens } from '@modules/verticals/dining/constants/screens.constants';
import { EFoodStackScreens } from '@modules/verticals/food/constants/screens.constants';
import type { LinkingOptions } from '@react-navigation/native';
import { EStackScreens, ETopScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';

/**
 * Deep linking configuration for the application.
 */
export const linking: LinkingOptions<AppStackParamsList> = {
    prefixes: ['super://app'],
    config: {
        screens: {
            [EStackScreens.LOGIN]: 'login',
            [EStackScreens.MAIN]: {
                screens: {
                    [ETopScreens.FOOD]: {
                        screens: {
                            [EFoodStackScreens.RECIPE_DETAILS]: 'food/recipe/:id',
                            [EFoodStackScreens.FOOD_CART]: 'food/cart',
                        },
                    },
                    [ETopScreens.DINING]: {
                        screens: {
                            [EDiningStackScreens.EVENT_DETAILS]: 'dining/event/:id',
                        },
                    },
                },
            }
        },
    },
};
