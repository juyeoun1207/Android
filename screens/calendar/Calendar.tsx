import { Button, Text, View } from 'react-native';

const Calendar = ({ navigation }) => {
  return (
    <View>
      <Text>캘린더 화면</Text>
      <Button title="홈으로 이동" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
export default Calendar