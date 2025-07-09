

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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
	const [appList, setAppList] = useState([])
	const [weekList, setWeekList] = useState([])
	const [weekSuccessRate, setWeekSuccessRate] = useState(0)
	const [appPerWeekList, setAppPerWeekList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const setCurrentApp = currentAppZustand(state => state.setCurrentApp)
	const calcTodayInfo = (stats) => {
		const usageMap = []
		stats.today.forEach(item => {
			const pkg = item.packageName;
			const name = item.appName
			const icon = item.iconBase64
			const time = item.totalTimeInForeground || 0;
			const findIndex = usageMap.findIndex(e => e.pkg == pkg)
			if(findIndex != -1){
				usageMap[findIndex].time += time
			}
			else{
				usageMap.push({pkg: pkg, name: name,icon: icon, time: time})
			}
		})
		let largeTime = 0
		const mergedStats = usageMap.filter(e => e.pkg != "com.myfirstapp").sort((a,b) => {
			if(a.time > largeTime) largeTime = a.time
			if(b.time > largeTime) largeTime = b.time
			return b.time - a.time
		})
		mergedStats.map(data => {
			data.ratio = data.time * 90 / largeTime
			return data
		});
		setAppList(mergedStats)
	}
	const calcWeekInfo = (stats) => {
		const weekMap = []
		const appWeekMap = []
		const totalApp = []
		let largeTime = 0
		const dayTypeList = ["일","월","화","수","목","금","토"]
		dayTypeList.forEach(dayType => {
			let time = 0
			if(stats.weekly[dayType]){
				stats.weekly[dayType].map(({packageName, totalTimeInForeground}) => {
					time += Number(totalTimeInForeground || 0)
					if(!totalApp.some(e => e == packageName)) totalApp.push(packageName)
				})
			}
			if(time > largeTime) largeTime = time
			weekMap.push({dayType:dayType, time: time})
		})
		totalApp.map(pkgName => {
			let totalTime = 0
			let availableCnt = 0
			const item = {}
			dayTypeList.forEach(dayType => {
				let time = 0
				if(stats.weekly[dayType]){
					time = stats.weekly[dayType].filter(e => e.packageName == pkgName).reduce((a,b) => a+= Number(b.totalTimeInForeground || 0), 0)
					if(time > 0){
						totalTime += time
						availableCnt += 1
					}
				}
				item[dayType] = time
			})
			appWeekMap.push({pkg: pkgName, available_cnt: availableCnt, total_time: totalTime, week_time: item})
		})
		console.log(appWeekMap)
		setAppPerWeekList(appWeekMap)
		if(largeTime > 0){
			weekMap.map(data => {
				data.ratio = data.time * 100 / largeTime
			})
		}
		setWeekList(weekMap)
	}
	const calcWeekSuccessRate = async() => {
		const monthPhoto = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		const weekDates = getWeekDate()
		let totalRange = 0
		let totalSuccessRange = 0
		weekDates.forEach((date, index) => {
			let objectKey = 'day' + date
			totalRange += monthPhoto[objectKey].length
			totalSuccessRange += monthPhoto[objectKey].filter(e => e.path).length
		})
		if(totalRange > 0) setWeekSuccessRate(Number((totalSuccessRange * 100 / totalRange).toFixed(2)))
	}
	useEffect(() => {
		(async () => {
			try {
				const stats = await UsageMonitor.getAppUsageStats();
				if(stats?.today){
					calcTodayInfo(stats)
				}
				if(stats?.weekly){
					calcWeekInfo(stats)
				}
				await calcWeekSuccessRate()
				if(isLoading){
					setIsLoading(false)
				}
				return stats; // array of { packageName, totalTimeInForeground }
			  } catch (e) {
				console.error("Failed to get usage stats", e);
				return [];
			  }
		})();
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
		{isLoading
		?	<Container>
				<LoadingDog/>
				<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
					<CustomText style={{fontSize:30}}>로딩중...</CustomText>
				</View>
			</Container>
		:	<View style={{minHeight: screenHeight, backgroundColor:'#fff', position:'relative'}}>
				<View style={{paddingBottom:10, position:'absolute', zIndex:10, top:0, backgroundColor:"#fff", paddingTop:20, width:'100%', alignItems:'center', display:'flex', paddingLeft:'10%', paddingRight:'10%'}}>
					<CustomText style={{fontSize:25, marginTop:20, marginBottom:30}}>이번주 성공률: {weekSuccessRate}%</CustomText>
					<View style={{borderWidth:1, paddingTop:5, borderColor:'#000'}}>
						<View style={{marginBottom:10, alignItems:'center'}}>
							<CustomText>{`이번주 평균 사용시간 : ${weekList.filter(e => e.time > 0).length > 0 ? formatSecondsToHM(weekList.filter(e => e.time > 0).reduce((a,b) => a += Number(b.time || 0), 0) / weekList.filter(e => e.time > 0).length) : '0H'}`}</CustomText>
						</View>
						<View style={{width:'100%', flexDirection:'row', height:100, paddingLeft:5, paddingRight: 5, alignItems:'flex-end'}}>
							{weekList.map((data, index) => {
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
							{appList.map((data, index) => {
								
								return (
									<Pressable 
										key={index} 
										onPress={() => {
											navigation.navigate('AppSetting');
											setCurrentApp({...data, week_info: appPerWeekList.find(e => e.pkg == data.pkg)})
										}} 
										style={{...styles.appListBox, marginLeft:20, paddingRight:10, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', position:'relative'}}
									>
										<View style={{height:'100%', position:'absolute', left:0, width:data.ratio + '%', backgroundColor:'#F5E2B8'}}></View>
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
