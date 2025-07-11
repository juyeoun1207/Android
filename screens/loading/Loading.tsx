import { useEffect, useState } from 'react';
import { Text, Image,Pressable, View, StyleSheet } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import LoadingDog from '../../components/LoadingDog';
import soundTypeZustand from '../../store/soundType'
import vibrationTypeZustand from '../../store/vibrationType'
import tabTypeZustand from '../../store/tabType'
import AsyncStorage from '@react-native-async-storage/async-storage';
import currentChannelZustand from '../../store/currentChannel'
import {createAlarm} from '../../utils/handleAlarm'
import useQuoteZustand from '../../store/useQuote';
import generateId from '../../utils/generateId'
import {checkNotificationFlag} from '../../utils/checkNotificationFlag'
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	},
	imageBox:{
		position:'relative',
		width:200,
		height:200
	}
})

const Loading = ({ navigation }) => {
	const [loading, setLoading] = useState(true)
	const setTabType = tabTypeZustand((state) => state.setTabType)
	const currentChannel = currentChannelZustand(state => state.currentChannel)
	const setSoundType = soundTypeZustand((state) => state.setSoundType);
	const setVibrationType = vibrationTypeZustand((state) => state.setVibrationType);
	const setSelectedQuote = useQuoteZustand((state) => state.setSelectedQuote);
	const settingApp = async() => {
		setTabType('Home')
		const soundItem = await AsyncStorage.getItem('sound_type')
		const vibrationItem = await AsyncStorage.getItem('vibration_type')
		const quoteItem = await AsyncStorage.getItem('quote')
		if(soundItem) setSoundType(soundItem)
		if(vibrationItem) setVibrationType(vibrationItem)
		if(quoteItem) setSelectedQuote(quoteItem)
		await checkNotificationFlag(navigation)
		await createChannel()
	}
	const createChannel = async() => {
		if(!currentChannel){
			await createAlarm('default', true)
		}
		setLoading(false)
	}
	useEffect(() => {
		settingApp()
	}, []);
  return (
	<Pressable 
		style={({pressed}) => ({...styles.container})}
		onPress={() => {
			if(!loading) navigation.navigate('Home');
		}}
	>
		<Container>
			<LoadingDog text={"잔소리"} isLoading={loading}/>
		</Container>
	</Pressable>
  );
}
export default Loading