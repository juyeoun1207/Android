import React, {useState} from 'react'
import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';
const memberList=[
  {name:'RM', text:'책 한 장 넘겨볼 시간이에요.', id:1},
  {name:'JIN', text:'핸드폰 잠깐 놓고 맛있는 거 먹자!', id:2},
  {name:'SUGA', text:'다른 걸로 기분 전환하러 가자', id:3},
  {name: 'J-HOPE', text: '우리 같이 몸을 살짝 움직여볼까?', id:4},
  {name: 'JIMIN', text: '조금만 쉬면서 나를 돌봐줘요.', id:5},
  {name: 'V', text: '사진 한 장 찍으러 가볼래?', id:6},
  {name: 'JUNGKOOK', text: '지금 잠깐 손을 비워봐요!', id:7}
]
const BTS = ({ navigation }) => {
  const [currentMember, setCurrentMember] = useState('')
  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
          
          <Pressable onPress={() => navigation.navigate('Quote')}>
            <Icon name="arrow-back" size={30} color="#000" />
          </Pressable>

        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>방탄소년단 에디션</CustomText></View>
			
			      <View style={{gap: 16}}>
              {memberList.map((data, index) => {
                return(
               <View style={{marginBottom: 4}} key={index}>
                  <CustomText style={{fontSize:20}}>{data.name}</CustomText>
                  <Pressable onPress={() => {
                    Tts.speak(data.text);
                    setCurrentMember(data.name);
                    }}>
          		    <View style={{...styles.textBox, flexDirection: 'row', alignItems: 'center',}}>
                    {currentMember == data.name && <Icon name='check' size={24} color="#333"/>}
                    <CustomText style={{fontSize: 15, marginLeft: currentMember === data.name ? 8 : 32}}>{data.text}</CustomText>
                  </View>
                  
                  </Pressable>
               </View>
                )
              })}
               
			</View>
		</View>
    </Container>
  );
}


const styles = {
  textBox: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  }
};

export default BTS