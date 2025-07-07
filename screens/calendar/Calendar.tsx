import React, {useState} from 'react'
import { Image, Text, View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal'
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

	const [selectedImages, setSelectedImages] = useState([
    	require('../../assets/images/calendar-example.png'),
    	require('../../assets/images/calendar-example2.jpg'),
    	require('../../assets/images/calendar-example3.jpg'),
  	]);

  	const [currentImageIndex, setCurrentImageIndex] = useState(0);
 	const [representativeImages, setRepresentativeImages] = useState({});

	return (
		<Container>
			<View style={{display:'flex', width:'100%', paddingLeft:'5%', paddingRight:'5%', paddingTop:'40%', flex:1}}>
				<CalendarComponent
					markedDates={{
						[formatted]:{todayStyle: {color:'purple'}}
					}}
					dayComponent={({date, state, marking}) => {
						if(marking){
							return(
								<View style={{backgroundColor:'white', width:30, height:40}}>
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
										<Image
											source={require('../../assets/images/calendar-example.png')}
											style={{width:30, height:30, borderRadius:5}}
											resizeMode="contain"
										/>
									</TouchableOpacity>
								</View>
							)
						}
						return (
							<View style={{backgroundColor:'white', width:30, height:40}}>
								<TouchableOpacity 
									disabled={state == 'disabled' ? true : undefined}
									onPress={() => {
										console.log('pressed');
										setSelectedDate(date);
										setModalVisible(true);
									}}
								>
									<View style={{width:20, height:30}}>
										<Text style={[marking?.todayStyle, {fontSize:10}]}>{date.day}</Text>
									</View>
								</TouchableOpacity>
							</View>
						)
					}}
				/>
				<View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
					<CustomText style={{color:'#818181', marginRight:5}}>이미지 다운로드</CustomText>
					<Icon name="download" size={24} color="#818181"/>
				</View>
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

						<Image
						source={selectedImages[currentImageIndex]}
						style={{ width: 270, height: 300, marginHorizontal: 0 }}
						resizeMode="contain"
						/>

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
	);
}
export default Calendar