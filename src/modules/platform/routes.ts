import * as AuthScreens from './auth/screens';
import { NotificationListScreen } from './notifications/screens';
import { LiveTrackingScreen } from './location/screens';

const Routes = {
    ...AuthScreens,
    NotificationList: NotificationListScreen,
    LiveTracking: LiveTrackingScreen,
};

export default Routes;