import * as AuthScreens from './auth/screens';
import { NotificationListScreen } from './notifications/screens';
import { LiveTrackingScreen } from './location/screens';
import * as SettingScreens from './settings/screens';

const Routes = {
    ...AuthScreens,
    ...SettingScreens,
    LiveTracking: LiveTrackingScreen,
    NotificationList: NotificationListScreen,
};

export default Routes;