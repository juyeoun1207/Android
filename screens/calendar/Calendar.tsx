import {useState, useEffect, useRef} from 'react'
import { Image, Text, PermissionsAndroid, Platform, Alert, NativeModules, View, TouchableOpacity,Pressable, StyleSheet, Button } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import ViewShot, {captureRef} from 'react-native-view-shot'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal'
import useMutateHandleStar from '../../hooks/mutation/useMutateHandleStar'
import RNFS from 'react-native-fs'
import {monthObj} from '../../utils/listItem'
import {Camera, useCameraDevices} from 'react-native-vision-camera'
import AsyncStorage from '@react-native-async-storage/async-storage'
const styles = StyleSheet.create({
	markingDate: {
		color:'blue'
	},
	nonMarkingDate:{
		color:'#262729'
	},
	text: {
		fontFamily:'DungGeunMo'
	}
})
const today = new Date();
const formatted = today.toISOString().split('T')[0];
const Calendar = ({ navigation }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState('');
	const calendarRef = useRef();
	const [image, setImage] = useState('')
	const [photoMap, setPhotoMap] = useState({});
	const [isCamera, setIsCamera] = useState(false);
	const devices = useCameraDevices();
	const device = devices?.find(e => e.position == 'back');
	const cameraRef = useRef<Camera>(null);

	const handlePhoto = async() => {
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		let objectKey = 'day' + selectedDate.day
		if(cameraRef.current == null) return;
		const photo = await cameraRef.current.takePhoto({});
		const dateKey = new Date().toISOString().split('T')[0];
		const destPath = `${RNFS.DocumentDirectoryPath}/user-${dateKey}.jpg`;
		await RNFS.copyFile(photo.path, destPath);
		photoArr[objectKey].push({pkg:'user', date: dateKey, path: destPath})
		setSelectedImages(photoArr[objectKey].filter(e => e.path))
		setPhotoMap(photoArr)
		await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));

		Alert.alert('사진이 저장되었습니다!');
		setIsCamera(false)
	}
	// const mutateHandler = () => {
	// 	return ''
	// }
	// const isLoading = false

	const {mutate: mutateHandleStar, isLoading} = useMutateHandleStar({
		onSuccess:(data) => {
			setSelectedImages(data.images.filter(e => e.path))
			setPhotoMap(data.map)
			setCurrentImageIndex(0)

		}
	})
	const failedDates = {
    	'2025-07-08': true,
    	'2025-07-09': true,
  	};

	const [selectedImages, setSelectedImages] = useState([]);
	// require('../../assets/images/calendar-example.png'),
	// require('../../assets/images/calendar-example2.jpg'),
	// require('../../assets/images/calendar-example3.jpg'),

  	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const saveToGallery = async () => {
		try {
		  // 캡처
		  const uri = await captureRef(calendarRef, {
			format: 'png',
			quality: 1,
		  });
	  
		  // 저장 경로 (앱 전용 캐시 → DCIM/YourApp 으로 이동)
		  const fileName = `calendar_${Date.now()}.png`;
		  const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
	  
		  // 파일 복사
		  await RNFS.copyFile(uri, destPath);
	  
		  // 미디어 스캔 (갤러리에 표시되도록)
		  if (Platform.OS === 'android') {
			NativeModules.MediaScanner.scanFile(destPath, 'image/png');
		  }
	  
		  Alert.alert('저장 완료', '달력 이미지가 갤러리에 저장되었습니다.');
		} catch (e) {
		  console.error('갤러리 저장 실패:', e);
		  Alert.alert('저장 실패', '이미지를 저장하지 못했습니다.');
		}
	  };
	// useEffect(() => {
	// const loadPhotos = async () => {
	// 	const newMap = {};
	// 	const today = new Date();
	// 	const start = new Date(today);
	// 	start.setDate(start.getDate() - 30); // 한달 전부터
	// 	const end = new Date(today);
	// 	end.setDate(end.getDate() + 30); // 한달 후까지
	
	// 	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
	// 		const dateKey = d.toISOString().split('T')[0];
	// 		const path = await AsyncStorage.getItem(`photo-${dateKey}`);
	// 		if (path) newMap[dateKey] = path;
	// 	}
	// 	setPhotoMap(newMap);
	// };
	// loadPhotos();
	// }, []);
	const getInfo = async() => {
		let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
		setPhotoMap(photoArr)
	}
	useEffect(() => {
		getInfo()
	},[])

	return (
		<Container>
			{isCamera ? (
			<>
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
					<Button title="📸 촬영" onPress={() => handlePhoto()} />
				</View>
			</> )
			:
			(
			<>
			<View style={{display:'flex', width:'100%', paddingLeft:'5%', paddingRight:'5%', paddingTop:'40%', flex:1}}>
				<ViewShot ref={calendarRef}>
					<CalendarComponent
						markedDates={{
							[formatted]:{todayStyle: {color:'purple'}}
						}}
						dayComponent={({ date, state, marking }) => {
						// const key = date.dateString;
						// const path = photoMap[key];
						const key = 'day' + date.day; // 'YYYY-MM-DD'
						const items = photoMap?.[key]?.filter(e => e.path) 
						const path = items?.[0]?.path || '';
						const isFailed = !!!path && ((new Date(date.dateString).getMonth() == new Date().getMonth()) && (Number(date.day) < Number(new Date().getDate())));
						return (
							<TouchableOpacity
								key={key}
								style={{
									backgroundColor: 'white',
									width: 30,
									height: 45,
									alignItems: 'center',
								}}
								disabled={state === 'disabled' || isFailed} // 실패 날짜는 비활성화
								onPress={() => {
									// reset()
									if (!isFailed) {
										setSelectedDate(date);
										setModalVisible(true);
										setSelectedImages(items || []);
									}
								}}
							>
								{/* 날짜 숫자 */}
								<Text style={[marking?.todayStyle, { fontSize: 10, marginBottom: 2, textAlign:'center' }]}>
									{date.day}
								</Text>

								{/* 이미지 또는 실패 텍스트 */}
								{path 
								? 	<Image
										source={{ uri: 'file://' + path }}
										style={{ width: 30, height: 30, borderRadius: 5 }}
										resizeMode="contain"
									/>
								:	isFailed 
									?	<>
											<Text style={{...styles.text, marginTop:2, fontSize: 15, color: '#C51212' }}>
												실
											</Text>
											<Text style={{...styles.text,marginTop:-2, fontSize: 15, color: '#C51212' }}>
												패
											</Text>
										</>
									: null
								}
							</TouchableOpacity>
						);
						}}
					/>
				</ViewShot>
				<Pressable style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} onPress={saveToGallery}>
					<CustomText style={{color:'#818181', marginRight:5}}>이미지 다운로드</CustomText>
					<Icon name="download" size={24} color="#818181"/>
				</Pressable>
				{/* {image && <Image source={{uri: image}} style={{height:200, width:200}}/>} */}
			</View>
			<Modal
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				style={{ justifyContent: 'center', alignItems: 'center' }} 
			>
				<View style={{backgroundColor:'white', width:350, height:400, borderColor: '#cccccc', borderRadius: 10, padding: 20, alignItems:'center'}}>
					<CustomText style={{fontSize:25, marginBottom:10}}>
						{selectedDate?.year || ''}.{selectedDate?.month || ''}.{selectedDate?.day || ''}.
					</CustomText>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>

						<TouchableOpacity
							disabled={currentImageIndex === 0}
							onPress={() => setCurrentImageIndex(currentImageIndex - 1)}
							style={{ padding: 10 }}
						>
							<Icon
								name="arrow-left"
								size={24}
								color={currentImageIndex === 0 ? '#ccc' : '#000'}
							/>
						</TouchableOpacity>
						{selectedImages.length > 0
						?	<Image
								source={{ uri: 'file://' + selectedImages[currentImageIndex].path}}
								style={{ width: 250, height: 250, marginHorizontal: 0 }}
								resizeMode="contain"
							/>
						:	<TouchableOpacity onPress={() => setIsCamera(true)}>
								<View
									style={{
										width: 250,
										height: 250,
										borderColor: '#888',
										borderWidth: 1,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 12,
										marginTop:20,
										marginBottom:25
									}}
								>
									<Image
										source={require('../../assets/images/ImageIcon.png')}
										style={{ width: 100, height: 100, marginBottom:25 }}
									/>
									<CustomText style={{ fontSize: 20, color: '#888' }}>이미지 업로드하기</CustomText>
								</View>
							</TouchableOpacity>
						}
						<TouchableOpacity
							disabled={(currentImageIndex === (selectedImages.length - 1)) || selectedImages.length == 0}
							onPress={() => setCurrentImageIndex(currentImageIndex + 1)}
							style={{ padding: 10 }}
						>
							<Icon
								name="arrow-right"
								size={24}
								color={((currentImageIndex === (selectedImages.length - 1)) || selectedImages.length == 0) ? '#ccc' : '#000'}
							/>
						</TouchableOpacity>
					</View>
					{selectedImages.length > 0 && 
					<TouchableOpacity
						onPress={() => {
							if(!isLoading) mutateHandleStar({selectedDate, pkg: selectedImages[currentImageIndex].pkg})
						}}
						style={{ position: 'absolute', top: 40, right: 40 }}
					>
						<MaterialIcon
							name={
								selectedImages[currentImageIndex].star
								? 'star'
								: 'star-border'
							}
							size={30}
							color={
								selectedImages[currentImageIndex].star
								? '#FFD700'
								: '#ccc'
							}
						/>
					</TouchableOpacity>}

					<TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 5 }}>
						<CustomText style={{ fontSize: 20, marginTop:0 }}>닫기</CustomText>
					</TouchableOpacity>
					</View>
				</Modal>
			</>
			)}

			<Footer navigation={navigation}/>
		</Container>
	)
}
export default Calendar