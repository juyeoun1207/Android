import React, {useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/Home'
import CalendarScreen from './screens/calendar/Calendar'
import LoadingScreen from './screens/loading/Loading'
import SettingsScreen from './screens/settings/Settings'
import QuoteScreen from './screens/settings/components/Quote'
import BTSScreen from './screens/settings/components/BTS'
import ILLITScreen from './screens/settings/components/ILLIT'
import AppSettingScreen from './screens/home/components/AppSetting'
import CameraScreen from './screens/camera/CameraTest'
import TimeSettingScreen from './screens/home/components/TimeSetting'
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef, navigate} from './RootNavigation'
const Stack = createNativeStackNavigator();

const App = () => {
	useEffect(() => {
		return notifee.onForegroundEvent(async({type, detail}) => {
			if (
			  (type === EventType.ACTION_PRESS || type === EventType.PRESS) &&
			  detail.pressAction?.id === 'camera'
			) {
			  const alarmId = detail.notification?.data?.alarm_id;
				const appName = detail.notification?.data?.app_name;
				const pkgName = detail.notification?.data?.pkg_name;
			  await Promise.all([
				  AsyncStorage.setItem('NAVIGATE_TO_CAMERA', 'false'),
				  AsyncStorage.setItem('CURRENT_ALARM_ID', alarmId),
				  AsyncStorage.setItem('CURRENT_ALARMED_APP_NAME', appName),
				  AsyncStorage.setItem('CURRENT_ALAMRED_PKG_NAME', pkgName),
			  ]);
			  navigate('Camera');
			}
		})
	})
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" options={{headerShown: false}} component={LoadingScreen} />
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Calendar" options={{headerShown: false}} component={CalendarScreen} />
        <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
        <Stack.Screen name="Camera" options={{headerShown: false}} component={CameraScreen} />
        <Stack.Screen name="Quote" options={{headerShown: false}} component={QuoteScreen} />
        <Stack.Screen name="BTS" options={{headerShown: false}} component={BTSScreen} />
        <Stack.Screen name="ILLIT" options={{headerShown: false}} component={ILLITScreen} />
        <Stack.Screen name="AppSetting" options={{headerShown: false}} component={AppSettingScreen} />
        <Stack.Screen name="TimeSetting" options={{headerShown: false}} component={TimeSettingScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
