import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
const Quote = ({ navigation }) => {
  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>글귀 설정</CustomText></View>
			
			<View style={{gap: 16}}>
               <View style={{marginBottom: 4}}>
                  <View style={{gap:10}}>
                     <CustomText style={{fontSize:20}}>기본 글귀</CustomText>
          		      <View style={styles.textBox}><CustomText style={{fontSize: 15}}>잠시 잊은 할 일 없었나요?</CustomText></View>
                     <View style={styles.textBox}><CustomText style={{fontSize: 15}}>다시 집중할 시간입니다.</CustomText></View>
                     <View style={styles.textBox}><CustomText style={{fontSize: 15}}>지금 이 순간을 담아보면 어떨까요?</CustomText></View>
                  </View>
               </View>
               <View style={{marginBottom: 4}}>
                  <View style={{gap:10}}>
                     <CustomText style={{fontSize:20}}>직접 설정</CustomText>
          		      <View style={styles.writeBox}></View>
                  </View>
               </View>
			</View>
		</View>
            <Pressable
					onPress={() => {navigation.navigate('Settings')}}
				>
					<CustomText>설정 돌아가기</CustomText>
				</Pressable>
    </Container>
  );
}


const styles = {
   textBox: {
      width: '100%',
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
   },
   writeBox: {
      width: '100%',
      height: '50%',
      backgroundColor: '#fff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,

  }
};

export default Quote