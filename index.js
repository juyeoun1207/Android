/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { showOveruseAlarm } from './utils/handleAlarm';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('UsageOverLimitTask', () => async ({ appName }) => {
	console.log('[알림]', appName, '사용시간 초과 알림 울림');
  
	showOveruseAlarm(appName)
  });