import type { PlatformModuleManifest } from '@modules/module.types';
import { ELocationScreens } from './constants/screens.constants';

export const locationManifest: PlatformModuleManifest = {
  id: 'location',
  title: 'Location & Tracking',
  screens: [
    { name: ELocationScreens.LIVE_TRACKING, getComponent: () => require('./screens/live-tracking').default },
  ],
};

export default locationManifest;

