import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/Feather'
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
		<Footer navigation={navigation}/>
    </Container>
  );
}
export default Calendar