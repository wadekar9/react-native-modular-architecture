/**
 * @format
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { registerBackgroundMessageHandler } from './src/core/notifications/push.service';
import App from './src/app/App';
import { name as appName } from './app.json';

registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
