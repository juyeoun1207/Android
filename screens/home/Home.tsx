

import React, {useEffect, useState} from 'react'
import { Button, PermissionsAndroid,Dimensions,Image, Platform, Pressable, ScrollView, View } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import Footer from '../../components/Footer'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import notifee, {AndroidImportance, EventType, TriggerType, TimestampTrigger} from '@notifee/react-native'
import {useNavigation} from '@react-navigation/native'
import UsageMonitor from '../../utils/UsageMonitorModule'
import {showOveruseAlarm} from '../../utils/handleAlarm'
import LoadingDog from '../../components/LoadingDog';
import currentAppZustand from '../../store/currentApp'
import {monthObj} from '../../utils/listItem'
import {formatSecondsToHM} from '../../utils/formatTime'
import {getWeekDate} from '../../utils/getWeekDate'
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from '@react-native-async-storage/async-storage';
import useScreentime from '../../hooks/query/useScreentime'
// const appList=[
// 	{name:'instagram', id:1},
// 	{name:'kakaotalk', id:2},
// 	{name:'youtube', id:3},
// 	{name: 'naver blog', id:4},
//   ]
const weekTypeList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const screenHeight = Dimensions.get('window').height;
async function requestPermissions1() {
	console.log('start_permissions1')
	if (Platform.OS === 'android' && Platform.Version >= 33) {
		console.log('can_permissions1')
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		if(granted !== PermissionsAndroid.RESULTS.GRANTED){
			console.log('알림 권한 거부됨');
		}
	}
}
async function requestPermissions2() {
	console.log('start_permissions2')
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    if (
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.warn('위치 권한이 거부됨');
    }
}
async function scheduleAlarm2(){
	console.log('start')
	await notifee.displayNotification({
		title: '📷 행동 기록하자!',
		body: '지금 행동을 기록할 시간이에요.',
		android: {
		  channelId: 'alarm',
		  sound:'default'
		},
	  });
	  console.log('finished')
} 
async function scheduleAlarm3(){
	console.log('start')
	await notifee.displayNotification({
		id:'123',
		title: '📷 행동 기록하자!',
		body: '지금 행동을 기록할 시간이에요.',
		android: {
		  channelId: 'alarm',
		//   style: {
		// 	type: AndroidStyle.BIGPICTURE,
		// 	picture: '../../assets/images/loading-dog',
		//   },
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
	  });
	  console.log('finished')
} 
async function scheduleAlarm() {
	console.log('start')
	// 알림 채널 생성
	await notifee.createChannel({
	id: 'alarm',
	name: 'Alarm Channel',
	importance: AndroidImportance.HIGH,
	sound: 'alarmexample1', // 나중에 커스텀 사운드로 대체 가능
	});
	console.log('channel_created')

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
	console.log('alarm_reserved')
}

const Home = ({ navigation }) => {
	const [weekSuccessRate, setWeekSuccessRate] = useState(0)
	const setCurrentApp = currentAppZustand(state => state.setCurrentApp)
	const calcWeekSuccessRate = async() => {
		const monthPhoto = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		const weekDates = getWeekDate()
		let totalRange = 0
		let totalSuccessRange = 0
		weekDates.forEach((date, index) => {
			let objectKey = 'day' + date
			totalRange += monthPhoto[objectKey].filter(e => e.pkg != 'user').length
			totalSuccessRange += monthPhoto[objectKey].filter(e => e.path && e.pkg != 'user').length
		})
		return totalRange > 0 ? Number((totalSuccessRange * 100 / totalRange).toFixed(2)) : 0
	}
	const {mutate: mutateGetWeekSuccessRate, isLoading: loadingWeekRate} = useMutation({
		mutationFn: calcWeekSuccessRate,
		onSuccess:(data) => {
			setWeekSuccessRate(data)
		}
	})
	const {data : item =  {appList: [], appPerWeekList: [], weekList: []}, isLoading} = useScreentime()
	useEffect(() => {
		mutateGetWeekSuccessRate()
	},[])
	useEffect(() => {
		(async () => {
		  await requestPermissions2();
	
		  try {
			await UsageMonitor.startMonitoring();
			console.log('[✓] MonitoringService 시작됨');
		  } catch (e) {
			console.error('[X] MonitoringService 시작 실패:', e);
		  }
		})();
	  }, []); // 모니터링 해서 알림 호출
	// useEffect(() => {
	// 	requestPermissions1();
	// 	return notifee.onForegroundEvent(({type, detail}) => {
	// 		if((type === EventType.ACTION_PRESS || type === EventType.PRESS) && detail.pressAction?.id == 'camera'){
	// 			console.log('알림 클릭됨 -> 카메라로 이동');
	// 			navigation.navigate('Camera');
	// 		}
	// 	})
	// },[]) // 알림 호출 후 카메라로 이동
	return (
		<>
		{(isLoading || loadingWeekRate)
		?	<Container>
				<LoadingDog isLoading={isLoading || loadingWeekRate}/>
			</Container>
		:	<View style={{minHeight: screenHeight, backgroundColor:'#fff', position:'relative'}}>
				<View style={{paddingBottom:10, position:'absolute', zIndex:10, top:0, backgroundColor:"#fff", paddingTop:20, width:'100%', alignItems:'center', display:'flex', paddingLeft:'10%', paddingRight:'10%'}}>
					<CustomText style={{fontSize:25, marginTop:20, marginBottom:30}}>이번주 성공률: {weekSuccessRate}%</CustomText>
					<View style={{borderWidth:1, paddingTop:5, borderColor:'#000'}}>
						<View style={{marginBottom:10, alignItems:'center'}}>
							<CustomText>{`이번주 평균 사용시간 : ${item?.weekList.filter(e => e.time > 0).length > 0 ? formatSecondsToHM(item?.weekList.filter(e => e.time > 0).reduce((a,b) => a += Number(b.time || 0), 0) / item?.weekList.filter(e => e.time > 0).length) : '0H'}`}</CustomText>
						</View>
						<View style={{width:'100%', flexDirection:'row', height:100, paddingLeft:5, paddingRight: 5, alignItems:'flex-end'}}>
							{item?.weekList.map((data, index) => {
								return(
									<View key={index} style={{width:35, marginLeft: index == 0 ? 0 : 9, height:data.ratio, backgroundColor:'#F6C671'}}/>
								)
							})}
						</View>
					</View>
					<View  style={{flexDirection:'row', borderWidth:1, borderColor:'#fff', paddingLeft:5, paddingRight: 5}}>
						{weekTypeList.map((data, index) => {
							return(
								<View key={data} style={{width:35,alignItems:'center', marginLeft: index == 0 ? 0 : 9}}>
									<CustomText>{data}</CustomText>
								</View>
							)
						})}
					</View>
					{/* <View style={{width:'100%',marginTop:10,display:'flex', height:200, backgroundColor:'lightgray'}}>
						<Button 
							title="3초 후 알람 울리기" 
							onPress={scheduleAlarm} 
						/>
						<Button 
							title="크롬 사용시간 10초 넘었을 떄 알람설정" 
							onPress={() => {
								UsageMonitor.setUsageThreshold('com.android.chrome', 10) // 10초로 설정
									.then(() => console.log('제한 시간 설정됨'))
									.catch((e) => console.error('제한 시간 설정 실패', e));
							}} 
						/>
						<Button 
							title="크롬 알람 초기화" 
							onPress={() => {
								UsageMonitor.resetAlertedApps();
								console.log('알람초기화됨')
							}} 
						/>
					</View> */}
				</View>
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, paddingTop:270, paddingBottom:70}}>
					<View style={{display:'flex',width:'100%'}}>
						<View style={{gap:15}}>
							{item?.appList.map((data, index) => {
								
								return (
									<Pressable 
										key={index} 
										onPress={() => {
											navigation.navigate('AppSetting');
											setCurrentApp(data.pkg)
										}} 
										style={{...styles.appListBox, marginLeft:20, paddingRight:10, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', position:'relative'}}
									>
										<View style={{height:'100%', position:'absolute', left:0, width:data.ratio + '%', backgroundColor:'#F5E2B8',borderTopLeftRadius:7, borderBottomLeftRadius:7}}></View>
										<View style={{flexDirection:'row', alignItems:'center'}}>
											<Image
												source={{ uri: `data:image/png;base64,${data.icon}` }}
												style={{ width: 40, height: 40, marginRight: 10 }}
											/>
											<CustomText style={{fontSize:15}}>{data.name}</CustomText>
										</View>
										<SimpleIcon name="arrow-right" size={10} color="#333"/>
									</Pressable>
								)
							})}
						</View>
					</View>
				</ScrollView>
				<Footer navigation={navigation} style={{position:'absolute', bottom:0}}/>
			</View>
		}
		</>
	);
}

const styles = {
  appListBox: {
    width: '90%',
	height: 50,
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    paddingLeft: 12,
    borderRadius: 8,
  }
}

export default Home
