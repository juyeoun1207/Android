/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { executeAlarm, showOveruseAlarm } from './utils/handleAlarm';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	QueryClient,
	QueryClientProvider,
  } from '@tanstack/react-query'
import {monthObj} from './utils/listItem'
export const queryClient = new QueryClient();
const Main = () => (
	<QueryClientProvider client={queryClient}>
		<App/>
	</QueryClientProvider>
)
// 앱이 백그라운드일 때 알림 눌렀을 경우
notifee.onBackgroundEvent(async ({ type, detail }) => {
	console.log('on_background')
  if (
    (type === EventType.ACTION_PRESS || type === EventType.PRESS) &&
    detail.pressAction?.id === 'camera'
  ) {
	console.log('background_executed')
	const alarmId = detail.notification?.data?.alarm_id;
  	const appName = detail.notification?.data?.app_name;
  	const pkgName = detail.notification?.data?.pkg_name;
	await Promise.all([
		AsyncStorage.setItem('NAVIGATE_TO_CAMERA', 'true'),
		AsyncStorage.setItem('CURRENT_ALARM_ID', alarmId),
		AsyncStorage.setItem('CURRENT_ALARMED_APP_NAME', appName),
		AsyncStorage.setItem('CURRENT_ALAMRED_PKG_NAME', pkgName),
	]);
  }
});

AppRegistry.registerComponent(appName, () => Main);
AppRegistry.registerHeadlessTask('UsageOverLimitTask', () => async ({ appName, packageName }) => {
	console.log('[알림]', appName, '사용시간 초과 알림 울림');
	// showOveruseAlarm()
	let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
	let objectKey = 'day' + new Date().getDate()
	const item = photoArr[objectKey].find(e => e.pkg == packageName)
	if(!item || !item.path){
		const dateKey = new Date().toISOString().split('T')[0];
		const alarmId = dateKey + '_' + packageName + '_' + 'alarm'
		executeAlarm(alarmId, appName, packageName)
	}
});