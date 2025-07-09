import React, { useState, useEffect } from 'react'
import { View, Pressable, Platform,Alert, PermissionsAndroid } from 'react-native'
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker'
import currentAppZustand from '../../../store/currentApp'
import LoadingDog from '../../../components/LoadingDog';
import { useMutation } from "@tanstack/react-query";
import UsageMonitor from '../../../utils/UsageMonitorModule'
import {getWeekSuccessRate, getWeekAvgTime, getWeekSuccessList} from '../../../utils/getWeekViewInfo'
import invalidQuery from '../../../utils/invalidQuery'
import useAppTimeLimit from '../../../hooks/query/useAppTimeLimit'
import useScreentime from '../../../hooks/query/useScreentime'
import {monthObj} from '../../../utils/listItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
	const [isInit, setIsInit] = useState(false)
	const [isSet, setIsSet] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const currPkg = currentAppZustand(state => state.currentApp)
	const getAppInfo = async() => {
		const item = await getWeekSuccessList(appData)
		const result = await UsageMonitor.isUsageThresholdSet(appData.pkg)
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + new Date().getDate()
		let isSuccess = false
		if(photoArr[objectKey].find(e => e.pkg == currPkg)?.path) isSuccess = true
		return {list: item, isUsage: !!result, isSuccess: isSuccess}
	}
	const removeLimit = async() => {
		await UsageMonitor.removeUsageThreshold(appData.pkg);
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + new Date().getDate()
		const findIndex = photoArr[objectKey].findIndex(e => e.pkg == currPkg)
		if(findIndex != -1 && !photoArr[objectKey][findIndex].path){
			photoArr[objectKey] = photoArr[objectKey].filter(e => e.pkg != currPkg)
			await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));
		}
		const result = await UsageMonitor.isUsageThresholdSet(appData.pkg)
		return !!result
	}
	const {mutate: mutateRemoveLimit, isLoading} = useMutation({
		mutationFn: removeLimit,
		onSuccess:(data) => {

			setIsSet(data)
			invalidQuery({queryKey:['screentime']})
			invalidQuery({queryKey:['screentime_limit']})
			setSelectedHour(0)
			setSelectedMinute(0)
		}
	})
	const {mutate: mutateGetInfo, isLoading: loading} = useMutation({
		mutationFn: getAppInfo,
		onSuccess:(data) => {
			setWeek(data.list)
			setIsSet(data.isUsage)
			setIsSuccess(data.isSuccess)
		}
	})
	const {data : item =  {appList: [], appPerWeekList: [], weekList: []}, isLoading: loadingGetInfo} = useScreentime()
	const appData = item?.appList.find(e => e.pkg == currPkg) || {}
	const {data: timeLimit = '', isLoading: loadingTimeLimit} = useAppTimeLimit({
		pkg: appData?.pkg,
		enabled: !!appData?.pkg
	})
	useEffect(() => {
		if(timeLimit && !isInit){
			const hours = Math.floor(timeLimit / 3600);
			const minutes = Math.floor((timeLimit % 3600) / 60);
			setSelectedHour(hours)
			setSelectedMinute(minutes)
			setIsInit(true)
		}
	},[timeLimit])
	useEffect(() => {
		requestPermissions()
		mutateGetInfo()
	},[appData])

  return (
    <Container>
		{(loading || isLoading || loadingTimeLimit || loadingGetInfo)
		?	<>
				<LoadingDog isLoading={loading || isLoading || loadingTimeLimit || loadingGetInfo}/>
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
						if(selectedHour > 0 || selectedMinute > 0){
							if(isSet) UsageMonitor.resetAlertedApp(appData.pkg); // 울린 기록 초기화
							// UsageMonitor.setUsageThreshold(appData.pkg, 10)
							// 			.then(() => console.log('제한 시간 설정됨'))
							// 			.catch((e) => console.error('제한 시간 설정 실패', e));
							UsageMonitor.setUsageThreshold(appData.pkg, selectedHour * 3600 + selectedMinute * 60)
										.then(() => console.log('제한 시간 설정됨'))
										.catch((e) => console.error('제한 시간 설정 실패', e));
							if(isSuccess){
								Alert.alert('알림', '오늘은 완료되었으므로 내일부터 알람이 실행됩니다.')
							}
							navigation.navigate('AppSetting');
						}
						else{
							Alert.alert('설정 필요', '스크린타임 시간을 설정해주세요.');
						}
					}}
				>
					<CustomText style={{fontSize:15}}>확인</CustomText>
				</Pressable>
				{isSet && 
				<View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 30 }}>
					<Pressable 
						style={{width:150, marginTop: 20, alignItems: 'center', backgroundColor: '#fff', borderColor: '#c51212', borderWidth: 1, padding: 12, borderRadius: 10, alignSelf: 'center'}}
						onPress={async() => {
							mutateRemoveLimit()
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
