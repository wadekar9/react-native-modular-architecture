import * as AuthScreens from './auth/screens';
import { NotificationListScreen } from './notifications/screens';

const Routes = {
    ...AuthScreens,
    NotificationList: NotificationListScreen,
};

export default Routes;