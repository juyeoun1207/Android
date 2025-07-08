
import React, {useRef, useState} from 'react'
import {View, Button, Alert} from 'react-native'
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
	const device = devices?.find(e => e.position == 'back')
	const setTabType = tabTypeZustand((state) => state.setTabType)
	const takePhoto = async() => {
		console.log('start photo', cameraRef.current)
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + new Date().getDate()
		console.log(cameraRef.current, pkg, photoArr, objectKey);
		if(cameraRef.current == null || !pkg) return;
		const photo = await cameraRef.current.takePhoto({});
		const dateKey = new Date().toISOString().split('T')[0];
		const destPath = `${RNFS.DocumentDirectoryPath}/${pkg}-${dateKey}.jpg`;
		await RNFS.copyFile(photo.path, destPath);
		const findIndex = photoArr[objectKey].findIndex(e => e.pkg == pkg)
		photoArr[objectKey][findIndex].date = dateKey
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
				<LoadingDog/>
				<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
					<CustomText style={{fontSize:30}}>로딩중...</CustomText>
				</View>
			</Container>
		:	<Container>
				<CustomText>{name}</CustomText>
				<View style={{display:'flex',width:'100%', flex:1, justifyContent:'center', alignItems:'center'}}>
					{device &&
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
					<Button title="📸 촬영" onPress={takePhoto} />
				</View>
				<Footer navigation={navigation}/>
			</Container>
		}
		</>
	)
}
export default CameraTest