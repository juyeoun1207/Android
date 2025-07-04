import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/Home'
import CalendarScreen from './screens/calendar/Calendar'
import LoadingScreen from './screens/loading/Loading'
import SettingsScreen from './screens/settings/Settings'
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" options={{headerShown: false}} component={LoadingScreen} />
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Calendar" options={{headerShown: false}} component={CalendarScreen} />
        <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
