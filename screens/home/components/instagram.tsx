import React, {useState} from 'react'
import { Button, Pressable, TextInput, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
const defaultQuotes = []
const Week = [
  {name:'월요일', success_rate:'50%'},
  {name:'화요일', success_rate:'20%'},
  {name:'수요일', success_rate:'0%'},
  {name:'목요일', success_rate:'50%'},
  {name:'금요일', success_rate:'100%'},
  {name:'토요일', success_rate:'100%'},
  {name:'일요일', success_rate:'100%'},
];


const instagram = ({ navigation }) => {
   const [text, setText] = useState('')
   const [currentQuote, setCurrentQuote] = useState('');
   return (
    <Container>
      <View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>

         <Pressable onPress={() => navigation.navigate('Settings')}>
            <Icon name="arrow-back" size={30} color="#000" />
         </Pressable>

         <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
            <CustomText style={{ fontSize: 30 }}>인스타그램</CustomText>
         </View>

         <View>
            <CustomText style={{fontSize:20, marginBottom:15}}>시간 제한 : 2H</CustomText>

            {defaultQuotes.map((item, index) => (
            <Pressable
               key={index}
               onPress={() => {

               }}
               style={{...styles.quoteBox, flexDirection: 'row', alignItems: 'center', marginBottom: 8,}}>
                  <View style={{width:32}}>
                  {currentQuote === item.text && (<Icon name="check" size={20} color="#333" />
                  )}
                  </View>
                  <CustomText style={{fontSize: 15}}>
                  {item.text}
                  </CustomText>
            </Pressable>
            ))}


            <View style={{ marginTop: 10 }}>
            <Pressable
               onPress={() => {navigation.navigate('BTS')}}
               style={styles.quoteBox}
            >
               <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', height:'100%' }}>
                  <View style={{flexDirection: 'row', height:'100%', alignItems: 'center'}}>
                     <View style={{width:32}}>
                        <Icon name="check" size={20} color="#333" />
                     </View>
                     <CustomText style={{fontSize:15}}>방탄소년단 에디션</CustomText>
                  </View>
                  <SimpleIcon name="arrow-right" size={10} color="#333"/>
               </View>
            </Pressable>
            <View style={{marginBottom: 5}}></View>
            <Pressable
               onPress={() => {navigation.navigate('ILLIT')}}
               style={styles.quoteBox}
            >
               <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', height:'100%' }}>
                  <View style={{flexDirection: 'row', height:'100%', alignItems: 'center'}}>
                     <View style={{width:32}}>
                        <Icon name="check" size={20} color="#333" />
                     </View>
                     <CustomText style={{fontSize:15}}>아일릿 에디션</CustomText>
                  </View>
                  <SimpleIcon name="arrow-right" size={10} color="#333"/>
               </View>
            </Pressable>
            </View>

            <CustomText style={{fontSize:20, marginTop:50, marginBottom:15}}>직접 설정</CustomText>
            <TextInput 
               style={styles.writeBox} 
               value={text} 
               onChangeText={setText}
            />
            </View>
         </View>

   </Container>
  )
};


const styles = {
   quoteBox: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
   },
   writeBox: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,

  }
};

export default instagram