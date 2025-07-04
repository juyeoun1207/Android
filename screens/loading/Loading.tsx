import { Text, Image,Pressable, View, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	},
	imageBox:{
		position:'relative',
		width:200,
		height:200
	}
})
const Loading = ({ navigation }) => {
  return (
	<Pressable style={({pressed}) => ({...styles.container})} onPress={() => navigation.navigate('Home')}>
		<View style={{...styles.container, cursor:'pointer'}}>
			<View style={styles.imageBox}>
				<Image
					source={require('../../assets/images/lightening.png')}
					style={{width:70, height:70, position:'absolute', right:-10, top:-40}}
					resizeMode="contain"
				/>
				<Image
					source={require('../../assets/images/lightening2.png')}
					style={{width:70, height:70, position:'absolute', right:-40, top:-10}}
					resizeMode="contain"
				/>
				<Image
					source={require('../../assets/images/loading-dog.png')}
					style={{width:200, height:200}}
					resizeMode="contain"
				/>
			</View>
			<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
				<Text style={{fontFamily:'DungGeunMo', fontSize:30}}>잔소리</Text>

			</View>
		</View>
	</Pressable>
  );
}
export default Loading