import notifee from '@notifee/react-native';

export async function showOveruseAlarm(appName) {
  await notifee.displayNotification({
    title: '⚠️ 사용시간 초과',
    body: `${appName} 앱을 너무 오래 사용하고 있어요.`,
    android: {
      channelId: 'alarm',
      sound: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
}