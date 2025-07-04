import { Button, Text, View } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import Footer from '../../components/Footer'
const Settings = ({ navigation }) => {
  return (
    <Container>
		<View style={{display:'flex',width:'100%', flex:1, paddingTop:'10%'}}>
      		<View style={{height:'50%', width:'100%', alignItems:'center', display:'flex', paddingLeft:'10%', paddingRight:'10%'}}>
				<CustomText style={{fontSize:20}}>7/7 까지 성공률 : 30%</CustomText>
				<View style={{width:'100%',marginTop:10,display:'flex', flex:1, backgroundColor:'lightgray'}}></View>
			</View>
      		<View style={{height:'50%'}}>
				<View style={{height:50, width:'100%'}}>
					<CustomText>인스타그램</CustomText>
				</View>
				<View style={{width:'100%', backgroundColor:'red'}}>
					<View style={{width:30, height:30, backgroundColor:'gray'}}></View>
				</View>
			</View>
		</View>
		<Footer navigation={navigation}/>
    </Container>
  );
}
export default Settings