import * as AuthRoutes from '@modules/platform/auth';
import * as HomeRoutes from '$modules/home';
import * as NotificationRoutes from '@modules/platform/notifications';

export const PublicRoutes = {
	Login: AuthRoutes.Login,
	Splash: AuthRoutes.Splash,
};

export const PrivateRoutes = {
	Notifications: NotificationRoutes.Notifications,
};

export const BottomTabsRoutes = {
	Home: HomeRoutes.Home,
	Settings: HomeRoutes.Settings,
};
