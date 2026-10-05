import { createNavigationContainerRef } from '@react-navigation/native';
import { EStackScreens } from '@shared/constants/screens.constants';
import { AppStackParamsList } from '@shared/types/navigation.types';

export const navigationRef = createNavigationContainerRef<AppStackParamsList>();

export function navigate(name: EStackScreens, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}

export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};
