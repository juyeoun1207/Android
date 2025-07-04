import { Button, Text, View } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View>
      <Text>홈 화면</Text>
      <Button title="캘린더로 이동" onPress={() => navigation.navigate('Calendar')} />
    </View>
  );
}
export default Home
