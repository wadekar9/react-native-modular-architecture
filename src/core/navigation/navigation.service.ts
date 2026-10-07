import { createNavigationContainerRef, type ParamListBase } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(name: string, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
  }
}

export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};
