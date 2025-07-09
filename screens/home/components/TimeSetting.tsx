import React, { useState, useEffect } from 'react'
import { View, Pressable, Platform,PermissionsAndroid } from 'react-native'
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker'
import currentAppZustand from '../../../store/currentApp'
import LoadingDog from '../../../components/LoadingDog';
import UsageMonitor from '../../../utils/UsageMonitorModule'
import {getWeekSuccessRate, getWeekAvgTime, getWeekSuccessList} from '../../../utils/getWeekViewInfo'
async function requestPermissions() {
	console.log('start_permissions1')
	if (Platform.OS === 'android' && Platform.Version >= 33) {
		console.log('can_permissions1')
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		if(granted !== PermissionsAndroid.RESULTS.GRANTED){
			console.log('알림 권한 거부됨');
		}
	}
}
const TimeSetting = ({ navigation }) => {
  const [selectedHour, setSelectedHour] = useState(0)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [week, setWeek] = useState([])
  const [isSet, setIsSet] = useState(false)
  const [loading, setLoading] = useState(true)
  const appData = currentAppZustand(state => state.currentApp)
  const checkIsSet = async() => {
	const item = await UsageMonitor.isUsageThresholdSet(appData.pkg)
	setIsSet(!!item)
  }
  const getAppInfo = async() => {
	await Promise.all([
		getWeekSuccessList(setWeek, setLoading, appData),
		checkIsSet()
	])
  }
  useEffect(() => {
	requestPermissions()
	getAppInfo()
  },[appData])

  return (
    <Container>
		{loading
		?	<>
				<LoadingDog/>
				<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
					<CustomText style={{fontSize:30}}>로딩중...</CustomText>
				</View>
			</>
		:	<View style={{ flex:1, padding:'10%', width:'100%', backgroundColor:'#fff' }}>
				<Pressable onPress={() => navigation.navigate('AppSetting')}>
				<Icon name="arrow-back" size={30} color="#000" />
				</Pressable>

				<View style={{ alignItems:'center', marginTop:20, marginBottom:50 }}>
				<CustomText style={{ fontSize:30 }}>{appData.name}</CustomText>
				<CustomText style={{ fontSize:15, color:'gray', marginTop:20 }}>{getWeekSuccessRate(week)}</CustomText>
				<CustomText style={{ fontSize:15, color:'gray', marginTop:5 }}>{getWeekAvgTime(appData)}</CustomText>
				</View>

				<CustomText style={{ fontSize:20, marginBottom:15 }}>시간 제한 설정</CustomText>
				{/* 시 선택 */}
				<Picker
					selectedValue={selectedHour}
					onValueChange={setSelectedHour}
				>
				{[...Array(24).keys()].map(h => (
					<Picker.Item key={h} label={`${h}시간`} value={h} />
				))}
				</Picker>

				{/* 분 선택 */}
				<Picker
				selectedValue={selectedMinute}
				onValueChange={setSelectedMinute}
				>
				{[...Array(60).keys()].map(m => (
					<Picker.Item key={m} label={`${m}분`} value={m} />
				))}
				</Picker>
				<Pressable 
					style={{width:100, marginTop: 20, alignItems: 'center', backgroundColor: '#fff', borderColor: '#cccccc', borderWidth: 1, padding: 12, borderRadius: 10, alignSelf: 'flex-end'}}
					onPress={() => {
						if(isSet) UsageMonitor.resetAlertedApp(appData.pkg); // 울린 기록 초기화
						UsageMonitor.setUsageThreshold(appData.pkg, 10)
									.then(() => console.log('제한 시간 설정됨'))
									.catch((e) => console.error('제한 시간 설정 실패', e));
						// UsageMonitor.setUsageThreshold(appData.pkg, selectedHour * 3600 + selectedMinute * 60)
						// 			.then(() => console.log('제한 시간 설정됨'))
						// 			.catch((e) => console.error('제한 시간 설정 실패', e));
						navigation.navigate('AppSetting');
					}}
				>
					<CustomText style={{fontSize:15}}>확인</CustomText>
				</Pressable>
				{isSet && 
				<View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 30 }}>
					<Pressable 
						style={{width:150, marginTop: 20, alignItems: 'center', backgroundColor: '#fff', borderColor: '#c51212', borderWidth: 1, padding: 12, borderRadius: 10, alignSelf: 'center'}}
						onPress={async() => {
							await UsageMonitor.removeUsageThreshold(appData.pkg);
							await checkIsSet()
						}}
					>
						<CustomText style={{fontSize:15, color:'#C51212'}}>시간 제한 삭제</CustomText>
					</Pressable>
				</View>}
			</View>
		}
    </Container>
  )
}

const styles = {
   settingBox: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
   }
};

export default TimeSetting
