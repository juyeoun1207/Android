import { useEffect } from 'react';
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

const LoadingDog = () => {
  return (
		<View style={styles.imageBox}>
			<Image
				source={require('../assets/images/lightening.png')}
				style={{width:70, height:70, position:'absolute', right:-10, top:-40}}
				resizeMode="contain"
			/>
			<Image
				source={require('../assets/images/lightening2.png')}
				style={{width:70, height:70, position:'absolute', right:-40, top:-10}}
				resizeMode="contain"
			/>
			<Image
				source={require('../assets/images/loading-dog.png')}
				style={{width:200, height:200}}
				resizeMode="contain"
			/>
		</View>
  );
}
export default LoadingDog