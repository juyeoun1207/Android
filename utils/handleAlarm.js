import notifee, {AndroidImportance, EventType, TriggerType, TimestampTrigger} from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {monthObj} from '../utils/listItem'
export async function showOveruseAlarm(appName) {
  await notifee.displayNotification({
    title: '⚠️ 사용시간 초과',
    body: `${appName} 앱을 너무 오래 사용하고 있어요.`,
    android: {
      channelId: 'alarm',
      pressAction: {
        id: 'default',
      },
    },
  });
}
export async function createAlarm(channel_id, name, sound){
	await notifee.createChannel({
		id: channel_id,
		name: name,
		importance: AndroidImportance.HIGH,
		sound: sound
	});
}
export async function executeAlarm(id, appName, pkgName){
	console.log('executeAlarm')
	await notifee.displayNotification({
		id: id,
		title: '⚠️ 사용시간 초과',
		body: `${appName} 앱을 너무 오래 사용하고 있어요.`,
		android: {
			channelId: 'alarm',
			pressAction: {
				id: 'camera',
				launchActivity: 'default',
			},
			actions: [
				{
				  title: '바로 기록하기',
				  pressAction: {
					id: 'camera',
					launchActivity: 'default',
				  },
				},
				{
				  title: '나중에 할래요',
				  pressAction: {
					id: 'later',
				  },
				},
			],
		},
		data:{
			alarm_id: id,
			app_name: appName,
			pkg_name: pkgName
		}
	});
	console.log('finished_execute')
	let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
	let objectKey = 'day' + new Date().getDate()
	const findIndex = photoArr[objectKey].findIndex(e => e.pkg == pkgName)
	if(findIndex == -1){
		photoArr[objectKey].push({pkg: pkgName, date: '', path: ''})
		await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));
	}
	console.log('execute finished')
}
export async function scheduleAlarm() {
	// 알림 채널 생성
	await notifee.createChannel({
		id: 'alarm',
		name: 'Alarm Channel',
		importance: AndroidImportance.HIGH,
		sound: 'alarmexample1', // 나중에 커스텀 사운드로 대체 가능
	});

	// 3초 뒤 울리기
	const date = new Date(Date.now() + 3 * 1000);
	const trigger: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: date.getTime(),
		// alarmManager: true, // 애뮬레이터에서는 안됨
	};
	// 알림 예약
	await notifee.createTriggerNotification(
	{
		title: '🕒 행동 알람!',
		body: '지금 행동을 기록하세요.',
		android: {
			channelId: 'alarm',
			pressAction: {
				id: 'camera', // 클릭 시 앱 열기
			},
			sound: 'alarmexample1',
			actions: [
				{
				  title: '바로 기록하기',
				  pressAction: {
					id: 'camera',
				  },
				},
				{
				  title: '나중에 할래요',
				  pressAction: {
					id: 'later',
				  },
				},
			],
		},
	},
	trigger
	);
}