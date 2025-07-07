import {useState, useEffect, useRef} from 'react'
import { Image, Text, PermissionsAndroid, Platform, Alert, NativeModules, View, TouchableOpacity,Pressable, StyleSheet } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import ViewShot, {captureRef} from 'react-native-view-shot'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal'
import RNFS from 'react-native-fs'
import AsyncStorage from '@react-native-async-storage/async-storage'
const styles = StyleSheet.create({
	markingDate: {
		color:'blue'
	},
	nonMarkingDate:{
		color:'#262729'
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
	  
		  Alert.alert('✅ 저장 완료', '달력 이미지가 갤러리에 저장되었습니다.');
		} catch (e) {
		  console.error('갤러리 저장 실패:', e);
		  Alert.alert('❌ 저장 실패', '이미지를 저장하지 못했습니다.');
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
						dayComponent={({date, state, marking}) => {
							const key = date.dateString; // 'YYYY-MM-DD'
  							const path = photoMap[key];
							return(
								<View key={key} style={{backgroundColor:'white', width:30, height:40}}>
									<TouchableOpacity 
										disabled={state == 'disabled' ? true : undefined}
										onPress={() => {
											console.log('pressed');
											setSelectedDate(date);
											setModalVisible(true);
										}}
									>
										<View style={{width:20, height:10, marginBottom:5}}>
											<Text style={[marking?.todayStyle, {fontSize:10}]}>{date.day}</Text>
										</View>
										{path && 
										<Image
											// source={require('../../assets/images/calendar-example.png')}
											source={{uri: 'file://' + path}}
											style={{width:30, height:30, borderRadius:5}}
											resizeMode="contain"
										/>}
									</TouchableOpacity>
								</View>
							)
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
				<View style={{backgroundColor:'white', width:300, height:400, borderColor: '#cccccc', borderRadius: 10, padding: 20, alignItems:'center'}}>
					<CustomText style={{fontSize:25, marginBottom:10}}>
						{selectedDate?.year || ''}.{selectedDate?.month || ''}.{selectedDate?.day || ''}.
					</CustomText>
					<Image
						source={require('../../assets/images/calendar-example.png')}
						style={{width: 200, height: 200}}
						resizeMode='contain'
					/>
					<TouchableOpacity
						onPress={() => setModalVisible(false)}
						style={{marginTop: 15}}
					>
						<CustomText>닫기</CustomText>
					</TouchableOpacity>
				</View>
			</Modal>
			<Footer navigation={navigation}/>
		</Container>
	)
}
export default Calendar