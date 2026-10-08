import type { PlatformModuleManifest } from '@modules/module.types';
import { EAuthScreens } from './constants/screens.constants';

export const authManifest: PlatformModuleManifest = {
  id: 'auth',
  title: 'Authentication',
  screens: [
    { name: EAuthScreens.SPLASH, getComponent: () => require('./screens/splash').default },
    { name: EAuthScreens.LOGIN, getComponent: () => require('./screens/login').default },
    { name: EAuthScreens.REGISTER, getComponent: () => require('./screens/register').default },
    { name: EAuthScreens.FORGOT_PASSWORD, getComponent: () => require('./screens/forgot-password').default },
    { name: EAuthScreens.RESET_PASSWORD, getComponent: () => require('./screens/reset-password').default },
    { name: EAuthScreens.OTP_VERIFICATION, getComponent: () => require('./screens/otp-verification').default },
  ],
};

export default authManifest;

