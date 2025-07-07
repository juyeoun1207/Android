import React from 'react';
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
import instagramScreen from './screens/home/components/instagram'
import CameraScreen from './screens/camera/CameraTest'
import TimeSettingScreen from './screens/home/components/TimeSetting'
const Stack = createNativeStackNavigator();
const App = () => {
	
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" options={{headerShown: false}} component={LoadingScreen} />
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Calendar" options={{headerShown: false}} component={CalendarScreen} />
        <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
        <Stack.Screen name="Camera" options={{headerShown: false}} component={CameraScreen} />
        <Stack.Screen name="Quote" options={{headerShown: false}} component={QuoteScreen} />
        <Stack.Screen name="BTS" options={{headerShown: false}} component={BTSScreen} />
        <Stack.Screen name="ILLIT" options={{headerShown: false}} component={ILLITScreen} />
        <Stack.Screen name="instagram" options={{headerShown: false}} component={instagramScreen} />
        <Stack.Screen name="TimeSetting" options={{headerShown: false}} component={TimeSettingScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
