import { Text, Image,Button, View, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	}
})
const Footer = ({ navigation }) => {
  return (
	<View style={{width:'100%', flexDirection:'row'}}>
		<View style={{width:'25%'}}>
			<Button
				title="로딩" 
				onPress={() => navigation.navigate('Loading')} 
			/>
		</View>
		<View style={{width:'25%'}}>
			<Button
				title="홈" 
				onPress={() => navigation.navigate('Home')} 
			/>
		</View>
		<View style={{width:'25%'}}>
			<Button
				title="캘린더" 
				onPress={() => navigation.navigate('Calendar')} 
			/>
		</View>
		<View style={{width:'25%'}}>
			<Button
				title="추가" 
				onPress={() => navigation.navigate('Loading')} 
			/>
		</View>
	</View>
  );
}
export default Footer