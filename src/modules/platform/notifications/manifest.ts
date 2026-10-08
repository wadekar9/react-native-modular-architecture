import type { PlatformModuleManifest } from '@modules/module.types';
import { ENotificationScreens } from './constants/screens.constants';

export const notificationsManifest: PlatformModuleManifest = {
  id: 'notifications',
  title: 'Notifications',
  screens: [
    { name: ENotificationScreens.NOTIFICATIONS, getComponent: () => require('./screens/notification-list').default },
  ],
};

export default notificationsManifest;

