import type { PlatformModuleManifest } from '@modules/module.types';
import { ESettingsScreens } from './constants/screens.constants';

export const settingsManifest: PlatformModuleManifest = {
  id: 'settings',
  title: 'Settings & Profile',
  screens: [
    { name: ESettingsScreens.SETTINGS, getComponent: () => require('./screens/settings').default },
    { name: ESettingsScreens.EDIT_PROFILE, getComponent: () => require('./screens/edit-profile').default },
  ],
};

export default settingsManifest;

