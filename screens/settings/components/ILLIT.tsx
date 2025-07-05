import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
const ILLIT = ({ navigation }) => {
  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>아일릿 에디션</CustomText></View>
			
			<View style={{gap: 16}}>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>YUNAH</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>윤아</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>MINJU</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>민주</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>SUGA</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>모카</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>WONHEE</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>원희</CustomText></View>
               </View>
               <View style={{marginBottom: 4}}>
                  <CustomText style={{fontSize:20}}>IROHA</CustomText>
          		   <View style={styles.textBox}><CustomText style={{fontSize: 20}}>이로하</CustomText></View>
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

export default ILLIT