import {useState, useEffect, useRef} from 'react'
import { Image, Text, PermissionsAndroid, Platform, Alert, NativeModules, View, TouchableOpacity,Pressable, StyleSheet } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import ViewShot, {captureRef} from 'react-native-view-shot'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal'
import RNFS from 'react-native-fs'
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

	const failedDates = {
    	'2025-07-08': true,
    	'2025-07-09': true,
  	};

	const [selectedImages, setSelectedImages] = useState([
    	require('../../assets/images/calendar-example.png'),
    	require('../../assets/images/calendar-example2.jpg'),
    	require('../../assets/images/calendar-example3.jpg'),
  	]);

  	const [currentImageIndex, setCurrentImageIndex] = useState(0);
 	const [representativeImages, setRepresentativeImages] = useState({});
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
	useEffect(() => {
	const loadPhotos = async () => {
		const newMap = {};
		const today = new Date();
		const start = new Date(today);
		start.setDate(start.getDate() - 30); // 한달 전부터
		const end = new Date(today);
		end.setDate(end.getDate() + 30); // 한달 후까지
	
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const dateKey = d.toISOString().split('T')[0];
		const path = await AsyncStorage.getItem(`photo-${dateKey}`);
		if (path) newMap[dateKey] = path;
		}
		setPhotoMap(newMap);
	};
	loadPhotos();
	}, []);

	return (
		<Container>
			<View style={{display:'flex', width:'100%', paddingLeft:'5%', paddingRight:'5%', paddingTop:'40%', flex:1}}>
				<ViewShot ref={calendarRef}>
					<CalendarComponent
						markedDates={{
							[formatted]:{todayStyle: {color:'purple'}}
						}}
						dayComponent={({ date, state, marking }) => {
						const key = date.dateString;
						const path = photoMap[key];
						const isFailed = failedDates[key];

						return (
							<View
							key={key}
							style={{
								backgroundColor: 'white',
								width: 30,
								height: 45,
								alignItems: 'center',
							}}
							>
							<TouchableOpacity
								disabled={state === 'disabled' || isFailed} // 실패 날짜는 비활성화
								onPress={() => {
								if (!isFailed) {
									setSelectedDate(date);
									setModalVisible(true);
								}
								}}
							>
								{/* 날짜 숫자 */}
								<Text style={[marking?.todayStyle, { fontSize: 10, marginBottom: 2, textAlign:'center' }]}>
								{date.day}
								</Text>

								{/* 이미지 또는 실패 텍스트 */}
								{path ? (
								<Image
									source={{ uri: 'file://' + path }}
									style={{ width: 30, height: 30, borderRadius: 5 }}
									resizeMode="contain"
								/>
								) : isFailed ? (
								<Text style={{...styles.text, marginTop:2, fontSize: 15, color: 'red' }}>
									실패
								</Text>
								) : null}
							</TouchableOpacity>
							</View>
						);
						}}
					/>
				</ViewShot>
				<Pressable style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} onPress={saveToGallery}>
					<CustomText style={{color:'#818181', marginRight:5}}>이미지 다운로드</CustomText>
					<Icon name="download" size={24} color="#818181"/>
				</Pressable>
				{image && <Image source={{uri: image}} style={{height:200, width:200}}/>}
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

						{/* <Image
						source={selectedImages[currentImageIndex]}
						style={{ width: 270, height: 300, marginHorizontal: 0 }}
						resizeMode="contain"
						/> */}

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

						<TouchableOpacity
						disabled={currentImageIndex === selectedImages.length - 1}
						onPress={() => setCurrentImageIndex(currentImageIndex + 1)}
						style={{ padding: 10 }}
						>
						<Icon
							name="arrow-right"
							size={24}
							color={currentImageIndex === selectedImages.length - 1 ? '#ccc' : '#000'}
						/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={() => {
						setRepresentativeImages({
							...representativeImages,
							[selectedDate]: selectedImages[currentImageIndex]
						});
						}}
						style={{ position: 'absolute', top: 40, right: 40 }}
					>
						<MaterialIcon
						name={
							representativeImages[selectedDate] === selectedImages[currentImageIndex]
							? 'star'
							: 'star-border'
						}
						size={30}
						color={
							representativeImages[selectedDate] === selectedImages[currentImageIndex]
							? '#FFD700'
							: '#ccc'
						}
						/>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 5 }}>
						<CustomText style={{ fontSize: 20, marginTop:0 }}>닫기</CustomText>
					</TouchableOpacity>
					</View>
				</Modal>

			<Footer navigation={navigation}/>
		</Container>
	)
}
export default Calendar