import React, {useState} from 'react'
import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';
const memberList=[
  {name:'YUNAH', text:'지금은 잠깐 다른 걸 해봐요.', id:1},
  {name:'MINJU', text:'핸드폰 말고 나랑 놀자!', id:2},
  {name:'MOKA', text:'우리 잠깐 멍때리기 타임 어때요?', id:3},
  {name: 'WONHEE', text: '눈도 쉬어야 해요! 잠깐 멀리 보기~', id:4},
  {name: 'IROHA', text: '폰 잠깐 멈추고 춤 한 번 춰볼까?', id:5},
]
const ILLIT = ({ navigation }) => {
  const [currentMember, setCurrentMember] = useState('')
  return (
    <Container>
        <View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
          
          <Pressable onPress={() => navigation.navigate('Quote')}>
            <Icon name="arrow-back" size={30} color="#000" />
          </Pressable>

          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
            <CustomText style={{ fontSize: 30 }}>아일릿 에디션</CustomText></View>
      
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
                    {currentMember == data.name &&<Icon name='check' size={24} color="#333"/>}
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

export default ILLIT