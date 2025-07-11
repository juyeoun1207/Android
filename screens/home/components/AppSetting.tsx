import React, {useEffect, useState} from 'react'
import { ScrollView, Pressable, TextInput, View, Text } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import currentAppZustand from '../../../store/currentApp'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {monthObj, weekList} from '../../../utils/listItem'
import {getWeekDate} from '../../../utils/getWeekDate'
import { useMutation } from "@tanstack/react-query";
import UsageMonitor from '../../../utils/UsageMonitorModule'
import LoadingDog from '../../../components/LoadingDog';
import {formatSecondsToHM} from '../../../utils/formatTime'
import {getWeekSuccessRate, getWeekAvgTime, getWeekSuccessList} from '../../../utils/getWeekViewInfo'
import useAppTimeLimit from '../../../hooks/query/useAppTimeLimit'
import useScreentime from '../../../hooks/query/useScreentime'
const AppSetting = ({ navigation }) => {
	const [week, setWeek] = useState([])
	const currPkg = currentAppZustand(state => state.currentApp)
	const getInfo = async() => {
		const result = await getWeekSuccessList(appData)
		return result
	}
	const {mutate: mutateGetInfo, isLoading: loading} = useMutation({
		mutationFn: getInfo,
		onSuccess:(data) => {
			setWeek(data)
		}
	})
	const {data : item =  {appList: [], appPerWeekList: [], weekList: []}, isLoading: loadingGetInfo, isFetching} = useScreentime()
	const appData = item?.appList.find(e => e.pkg == currPkg) || {}
	const {data: timeLimit = '', isLoading, isFetching: fetchingLimit} = useAppTimeLimit({
		pkg: appData?.pkg,
		enabled: !!appData?.pkg
	})
	useEffect(() => {
		mutateGetInfo()
	},[appData])
	return (
		<Container>
			{(loading || isLoading || loadingGetInfo || isFetching || fetchingLimit)
			?	<>
					<LoadingDog isLoading={loading || isLoading || loadingGetInfo || isFetching || fetchingLimit}/>
				</>
			:	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
					<Pressable onPress={() => navigation.navigate('Home')}>
						<Icon name="arrow-back" size={30} color="#000" />
					</Pressable>

					<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
						<CustomText style={{ fontSize: 30 }}>{appData.name}</CustomText>
						<CustomText style={{ fontSize : 15, color: 'gray', marginTop:20}}>{getWeekSuccessRate(week)}</CustomText>
						<CustomText style={{ fontSize : 15, color: 'gray', marginTop:5}}>{getWeekAvgTime(appData)}</CustomText>
					</View>
					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, paddingTop:0, paddingTop:30, paddingBottom:20}}>
					<View>
						<CustomText style={{fontSize:20, marginBottom:15}}>{`시간 제한 : ${timeLimit ? formatSecondsToHM(timeLimit) : '없음'}`}</CustomText>
						<View>
							<Pressable
								onPress={() => {navigation.navigate('TimeSetting')}}
								style={styles.settingBox}
							>
								<View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', height:'100%' }}>
									<View style={{flexDirection: 'row', height:'100%', alignItems: 'center'}}>
										<CustomText style={{fontSize:15}}>시간 제한 변경</CustomText>
									</View>
									<SimpleIcon name="arrow-right" size={10} color="#333"/>
								</View>
							</Pressable>
							<View style={{marginBottom: 5}}></View>
						</View>

						<CustomText style={{fontSize:20, marginTop:30, marginBottom:15}}>이번 주 리포트</CustomText>
						{week.map((item, index) => (
							<Pressable
								key={index}
								style={{...styles.settingBox, flexDirection: 'row', alignItems: 'center', marginBottom: 8}}
							>
									<CustomText style={{fontSize: 15}}>
										{item.name} : {item.state == 'success' ? '성공!' : (item.state == 'fail' ? '실패..' : (item.state == 'not_alarmed' ? '적용 안함' : ''))}
									</CustomText>
							</Pressable>
						))}
					</View>
					</ScrollView>
				</View>
			}
	</Container>
	)
};


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

export default AppSetting