import { useEffect } from 'react';
import { Text, Image,Pressable, View, StyleSheet } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import LoadingDog from '../../components/LoadingDog';
import tabTypeZustand from '../../store/tabType'
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
	const setTabType = tabTypeZustand((state) => state.setTabType)
	useEffect(() => {
		setTabType('Home')
	},[])
  return (
	<Pressable style={({pressed}) => ({...styles.container})} onPress={() => navigation.navigate('Home')}>
		<Container>
			<LoadingDog/>
			<View style={{display:'flex', width:'100%', marginTop:-15, alignItems:'center'}}>
				<CustomText style={{fontSize:30}}>잔소리</CustomText>

			</View>
		</Container>
	</Pressable>
  );
}
export default Loading