import { Text, Pressable, Button, View, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import tabTypeZustand from '../store/tabType'
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	}
})

const Footer = ({ navigation, style }) => {
	const tabType = tabTypeZustand((state) => state.tabType)
	const setTabType = tabTypeZustand((state) => state.setTabType)
	return (
		<View style={{...style, width:'100%', flexDirection:'row', borderTopWidth:1, borderTopColor:'#a9a9a9'}}>
			<Pressable
				style={{width:'33%', backgroundColor: tabType == 'Calendar' ? '#efefef' : '#fff', height:50, justifyContent:'center', alignItems:'center'}}
				onPress={() => {
					setTabType('Calendar');
					navigation.navigate('Calendar')
				}} 
			>
				<CustomText>캘린더</CustomText>
			</Pressable>
			<Pressable
				style={{width:'34%', backgroundColor: tabType == 'Home' ? '#efefef' : '#fff', height:50, justifyContent:'center', alignItems:'center'}}
				onPress={() => {
					setTabType('Home');
					navigation.navigate('Home')
				}} 
			>
				<CustomText>홈</CustomText>
			</Pressable>
			<Pressable
				style={{width:'33%', backgroundColor: tabType == 'Settings' ? '#efefef' : '#fff', height:50, justifyContent:'center', alignItems:'center'}}
				onPress={() => {
					setTabType('Settings');
					navigation.navigate('Settings')
				}} 
			>
				<CustomText>알람설정</CustomText>
			</Pressable>
		</View>
	);
}
export default Footer