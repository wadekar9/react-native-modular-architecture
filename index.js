/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import './src/app/dev/i18n-config.dev';

AppRegistry.registerComponent(appName, () => App);
