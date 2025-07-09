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
	const setCurrentChannel = currentChannelZustand(state => state.setCurrentChannel)
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
			setCurrentChannel('alarm')
			await createAlarm('alarm','default', true)
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
			<LoadingDog/>
			<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
				<CustomText style={{fontSize:30}}>{loading ? '로딩중...' : '잔소리'}</CustomText>

			</View>
		</Container>
	</Pressable>
  );
}
export default Loading