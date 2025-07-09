
import React, {useRef, useState} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import {Camera, useCameraDevices} from 'react-native-vision-camera'
import {useEffect} from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import CustomText from '../../components/CustomText'
import RNFS from 'react-native-fs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tabTypeZustand from '../../store/tabType'
import LoadingDog from '../../components/LoadingDog'
import {monthObj} from '../../utils/listItem'
const styles = StyleSheet.create({
	markingDate: {
		color:'blue'
	},
	nonMarkingDate:{
		color:'#262729'
	},
	text: {
		fontFamily:'DungGeunMo'
	},
	cameraButtonContainer: {
		position: 'relative', /* 부모 요소에 위치 지정 */
		width: 50,/* 버튼의 너비 */
		height: 50 /* 버튼의 높이 */
	},
	  
	outerCircle: {
		position: 'absolute', /* 부모 요소를 기준으로 위치 지정 */
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		borderRadius: '50%', /* 원형 테두리 */
		backgroundColor: '#000', /* 배경색 및 투명도 */
		borderWidth: 2, /* 테두리 */
		borderColor:'#fff'
	  },
	innerCircle: {
		position: 'absolute', /* 부모 요소를 기준으로 위치 지정 */
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)', /* 중앙 정렬 */
		width: '80%', /* 안쪽 원의 크기 */
		height: '80%', /* 안쪽 원의 크기 */
		borderRadius: '50%', /* 원형 테두리 */
		backgroundColor: '#fff' /* 흰색 배경 */
	  }
	  
})
async function requestPermissions(){
	console.log('request-permissions')
	const cameraPermission = await Camera.requestCameraPermission();
	const microPhonePermission = await Camera.requestMicrophonePermission();
	if(cameraPermission !== 'authorized'){
		console.log('카메라 권한 거부됨', cameraPermission);
	}
	if(microPhonePermission !== 'authorized'){
		console.log('마이크 권한 거부됨', microPhonePermission);
	}
	if(Platform.OS === 'android' && Platform.Version >= 33){
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
	}
}
const CameraTest = ({navigation}) => {
	const cameraRef = useRef<Camera>(null);
	const devices = useCameraDevices();
	const [pkg, setPKG] = useState('')
	const [name, setName] = useState('')
	const [loading, setLoading] = useState(true)
	const [isFront, setIsFront] = useState(false)
	const device = devices?.find(e => e.position == 'back')
	const deviceFront = devices?.find(e => e.position == 'front')
	const setTabType = tabTypeZustand((state) => state.setTabType)
	const takePhoto = async() => {
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + new Date().getDate()
		if(cameraRef.current == null || !pkg) return;
		const photo = await cameraRef.current.takePhoto({});
		const dateKey = new Date().toISOString().split('T')[0];
		const destPath = `${RNFS.DocumentDirectoryPath}/${pkg}-${dateKey}.jpg`;
		await RNFS.copyFile(photo.path, destPath);
		const findIndex = photoArr[objectKey].findIndex(e => e.pkg == pkg)
		photoArr[objectKey][findIndex].date = dateKey
		const now = new Date()
		photoArr[objectKey][findIndex].time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
		photoArr[objectKey][findIndex].path = destPath
		await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));
		Alert.alert('사진이 저장되었습니다!');
		setTabType('Calendar');
		navigation.navigate('Calendar')
	}
	const getCurrentAlarm = async() => {
		const [alarmId, appName, pkgName] = await Promise.all([
			AsyncStorage.getItem('CURRENT_ALARM_ID'),
			AsyncStorage.getItem('CURRENT_ALARMED_APP_NAME'),
			AsyncStorage.getItem('CURRENT_ALAMRED_PKG_NAME'),
		]);
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + new Date().getDate()
		if(photoArr[objectKey].find(e => e.pkg == pkgName)?.path){
			Alert.alert("완료됨", `${appName}의 오늘 스크린타임 행동 기록이 이미 존재합니다.`)
			navigation.navigate('Calendar')
		}
		else{
			setPKG(pkgName)
			setName(appName)
			setLoading(false)
			requestPermissions();
		}
	}
	useEffect(() => {
		getCurrentAlarm()
	},[])
	return(
		<>
		{loading
		?	<Container>
				<LoadingDog isLoading={loading}/>
			</Container>
		:	<Container>
				<CustomText>{name}</CustomText>
				<View style={{display:'flex',width:'100%', flex:1, justifyContent:'center', alignItems:'center'}}>
					{device && !isFront &&
						<Camera
							ref={cameraRef}
							style={{flex:1, width:'100%'}}
							device={device}
							isActive={true}
							photo={true}
							video={false}
							audio={false}
						/>
					}
					{deviceFront && isFront &&
						<Camera
							ref={cameraRef}
							style={{flex:1, width:'100%'}}
							device={deviceFront}
							isActive={true}
							photo={true}
							video={false}
							audio={false}
						/>
					}
					<View style={{height:80, backgroundColor:'#000', width:'100%',flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
						<View style={{width:50, height:50}}>
						</View>
						<TouchableOpacity style={{...styles.cameraButtonContainer}} onPress={takePhoto}>
							<View style={{...styles.outerCircle}}></View>
							<View style={{...styles.innerCircle}}></View>
						</TouchableOpacity>
						<TouchableOpacity style={{width: 50, alignItems:'flex-start'}} onPress={() => setIsFront(!isFront)}>
							<IconAwesome color="#fff" size={24} name="cameraswitch"/>
						</TouchableOpacity>
					</View>
				</View>
				<Footer navigation={navigation}/>
			</Container>
		}
		</>
	)
}
export default CameraTest