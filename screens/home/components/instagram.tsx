import React, {useState} from 'react'
import { Button, Pressable, TextInput, View, Text } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
const defaultQuotes = []
const Week = [
  {name:'월요일', success_state:'성공!'},
  {name:'화요일', success_state:'성공!'},
  {name:'수요일', success_state:'실패..'},
  {name:'목요일', success_state:'성공!'},
  {name:'금요일', success_state:'실패..'},
  {name:'토요일', success_state:'성공!'},
  {name:'일요일', success_state:'실패..'},
];


const instagram = ({ navigation }) => {
   const [week, setWeek] = useState('')
   return (
    <Container>
      <View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>

         <Pressable onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-back" size={30} color="#000" />
         </Pressable>

         <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
            <CustomText style={{ fontSize: 30 }}>인스타그램</CustomText>
            <CustomText style={{ fontSize : 15, color: 'gray', marginTop:20}}>이번 주 성공률 : 75%</CustomText>
            <CustomText style={{ fontSize : 15, color: 'gray', marginTop:5}}>이번 주 평균 이용 시간 : 1H 30M</CustomText>
         </View>

         <View>
            <CustomText style={{fontSize:20, marginBottom:15}}>시간 제한 : 2H</CustomText>
            <View>
            <Pressable
               onPress={() => {navigation.navigate('TimeSetting')}}
               style={styles.settingBox}
            >
               <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', height:'100%' }}>
                  <View style={{flexDirection: 'row', height:'100%', alignItems: 'center'}}>
                     <CustomText style={{fontSize:15}}>시간 제한 변경</CustomText>
                  </View>
                  <SimpleIcon name="arrow-right" size={10} color="#333"/>
               </View>
            </Pressable>
            <View style={{marginBottom: 5}}></View>
            </View>

            <CustomText style={{fontSize:20, marginTop:30, marginBottom:15}}>이번 주 리포트</CustomText>
            {Week.map((item, index) => (
            <Pressable
               key={index}
               onPress={() => {

               }}
               style={{...styles.settingBox, flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                  <CustomText style={{fontSize: 15}}>
                  {item.name} : {item.success_state}
                  </CustomText>
            </Pressable>
            ))}
            </View>
         </View>

   </Container>
  )
};


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

export default instagram