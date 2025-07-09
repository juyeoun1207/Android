import { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, Easing, Image} from 'react-native';
import CustomText from './CustomText';
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

const LoadingDog = ({text, isLoading}) => {
	const textArr = ['로', '딩', '중', '.', '.', '.'];
	const animations = useRef(textArr.map(() => new Animated.Value(0))).current;
	useEffect(() => {
		if(isLoading){
			const animate = (i: number) => {
			  Animated.sequence([
				Animated.timing(animations[i], {
				  toValue: -5,
				  duration: 300,
				  easing: Easing.out(Easing.ease),
				  useNativeDriver: true,
				}),
				Animated.timing(animations[i], {
				  toValue: 0,
				  duration: 300,
				  easing: Easing.in(Easing.ease),
				  useNativeDriver: true,
				}),
			  ]).start(() => {
				// 다음 글자 애니메이션
				animate((i + 1) % textArr.length);
			  });
			};
			animate(0);
		}
	},[])
  return (
	<>
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
		<View style={{display:'flex', marginTop:-15, alignItems:'center'}}>
			{isLoading
			?	<View style={{flexDirection:'row'}}>
					{textArr.map((char, index) => (
						<Animated.View
							key={index}
							style={{ transform: [{ translateY: animations[index] }] }}
						>
							<CustomText style={{fontSize:30}}>{char}</CustomText>
						</Animated.View>
					))}
				</View>
			:	<CustomText style={{fontSize:30}}>{text}</CustomText>
			}
		</View>
	</>
  );
}
export default LoadingDog