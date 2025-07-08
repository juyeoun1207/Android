import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkNotificationFlag = async (navigation) => {
	const shouldNavigate = await AsyncStorage.getItem('NAVIGATE_TO_CAMERA');
	if (shouldNavigate === 'true') {
		await AsyncStorage.removeItem('NAVIGATE_TO_CAMERA');
		navigation.navigate('Camera');
	}
};