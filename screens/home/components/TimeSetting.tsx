import React, { useState } from 'react'
import { View, Pressable, Text } from 'react-native'
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker'

const TimeSetting = ({ navigation }) => {
  const [selectedHour, setSelectedHour] = useState(0)
  const [selectedMinute, setSelectedMinute] = useState(0)

  return (
    <Container>
      <View style={{ flex:1, padding:'10%', width:'100%', backgroundColor:'#fff' }}>
        <Pressable onPress={() => navigation.navigate('instagram')}>
          <Icon name="arrow-back" size={30} color="#000" />
        </Pressable>

        <View style={{ alignItems:'center', marginTop:20, marginBottom:50 }}>
          <CustomText style={{ fontSize:30 }}>인스타그램</CustomText>
          <CustomText style={{ fontSize:15, color:'gray', marginTop:20 }}>이번 주 성공률 : 75%</CustomText>
          <CustomText style={{ fontSize:15, color:'gray', marginTop:5 }}>이번 주 평균 이용 시간 : 1H 30M</CustomText>
        </View>

        <CustomText style={{ fontSize:20, marginBottom:15 }}>시간 제한 설정</CustomText>
        {/* 시 선택 */}
        <Picker
          selectedValue={selectedHour}
          onValueChange={setSelectedHour}
        >
          {[...Array(24).keys()].map(h => (
            <Picker.Item key={h} label={`${h}시간`} value={h} />
          ))}
        </Picker>

        {/* 분 선택 */}
        <Picker
          selectedValue={selectedMinute}
          onValueChange={setSelectedMinute}
        >
          {[...Array(60).keys()].map(m => (
            <Picker.Item key={m} label={`${m}분`} value={m} />
          ))}
        </Picker>
        <View style={{width:100, marginTop: 20, alignItems: 'center', backgroundColor: '#fff', borderColor: '#cccccc', borderWidth: 1, padding: 12, borderRadius: 10, alignSelf: 'flex-end'}}>
        <CustomText style={{fontSize:15}}>확인</CustomText>
        </View>
      </View>
    </Container>
  )
}

const styles = {
   settingBox: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
   }
};

export default TimeSetting
