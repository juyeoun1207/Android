import { Button, Text, View } from 'react-native';
import Container from '../../components/Container'
import Footer from '../../components/Footer'
const Calendar = ({ navigation }) => {
  return (
    <Container>
		<View style={{display:'flex', flex:1}}>
      		<Text>홈 화면</Text>
		</View>
		<Footer navigation={navigation}/>
    </Container>
  );
}
export default Calendar