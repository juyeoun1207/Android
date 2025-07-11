import notifee, {AndroidImportance, EventType, TriggerType, TimestampTrigger} from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {monthObj} from '../utils/listItem'
import currentChannelZustand from '../store/currentChannel';
import useQuoteZustand from '../store/useQuote';
import generateId from './generateId';
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
export async function deleteAlarm(){
	const id = currentChannelZustand.getState().currentChannel
	await notifee.deleteChannel(id);
}
export async function createAlarm(sound, vibration){
	const channel_id = generateId()
	currentChannelZustand.getState().setCurrentChannel(channel_id)
	await notifee.createChannel({
		id: channel_id,
		name: '잔소리 알람',
		importance: AndroidImportance.HIGH,
		sound: sound,
		vibration: vibration
	});
}
export async function executeAlarm(id, appName, pkgName){
	const channelId = currentChannelZustand.getState().currentChannel
	const quotes = useQuoteZustand.getState().selectedQuote
	await notifee.displayNotification({
		id: id,
		title: `⚠️ ${appName} 사용시간 초과`,
		body: quotes,
		android: {
			channelId: channelId,
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
	let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
	let objectKey = 'day' + new Date().getDate()
	const findIndex = photoArr[objectKey].findIndex(e => e.pkg == pkgName)
	if(findIndex == -1){
		photoArr[objectKey].push({pkg: pkgName, date: '', path: '', app: appName})
		await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));
	}
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