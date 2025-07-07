
import React, {useRef} from 'react'
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
	const device = devices?.find(e => e.position == 'back')
	const setTabType = tabTypeZustand((state) => state.setTabType)
	const takePhoto = async() => {
		console.log('start photo', cameraRef.current)
		if(cameraRef.current == null) return;
		const photo = await cameraRef.current.takePhoto({});
		const dateKey = new Date().toISOString().split('T')[0];
		const destPath = `${RNFS.DocumentDirectoryPath}/${dateKey}.jpg`;
		await RNFS.copyFile(photo.path, destPath);
		await AsyncStorage.setItem(`photo-${dateKey}`, destPath);
		Alert.alert('사진이 저장되었습니다!');
		setTabType('Calendar');
		navigation.navigate('Calendar')
	}
	useEffect(() => {
		const status = Camera.getCameraPermissionStatus()
		console.log('카메라 권한', status)
		requestPermissions();
	},[])
	useEffect(() => {
		console.log('디바이스들', devices);
		console.log('cameraRef:', cameraRef.current);
	  }, [device]);
	return(
		<Container>
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
	)
}
export default CameraTest