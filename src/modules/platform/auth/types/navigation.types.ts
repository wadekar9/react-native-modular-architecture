import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EAuthScreens } from '../constants/screens.constants';

export type AuthStackParamsList = {
  [EAuthScreens.SPLASH]: undefined;
  [EAuthScreens.LOGIN]: undefined;
  [EAuthScreens.REGISTER]: undefined;
  [EAuthScreens.FORGOT_PASSWORD]: undefined;
  [EAuthScreens.OTP_VERIFICATION]: { email?: string } | undefined;
  [EAuthScreens.RESET_PASSWORD]: { email?: string; otp?: string } | undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamsList> = NativeStackScreenProps<AuthStackParamsList, T>;
export type AuthNavigationProps = NativeStackNavigationProp<AuthStackParamsList>;

