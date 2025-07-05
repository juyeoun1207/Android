import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
const BTS = ({ navigation }) => {
  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>방탄소년단 에디션</CustomText></View>
			
			<View style={{gap: 16}}>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>RM</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 알엠</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>JIN</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 진</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>SUGA</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 슈가</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>J-HOPE</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 제이홉</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>JIMIN</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 지민</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>V</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 뷔</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>JUNGKOOK</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>방탄소년단 정국</CustomText></View>
               </View>
			</View>
		</View>
            <Pressable
					onPress={() => {navigation.navigate('Settings')}}
					style={styles.settingBox}
				>
					<CustomText style={styles.settingText}>설정 돌아가기</CustomText>
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
  }
};

export default BTS