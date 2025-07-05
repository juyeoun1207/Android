import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import Footer from '../../components/Footer'
const Settings = ({ navigation }) => {
  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>알람 설정</CustomText></View>
			
			<View style={{gap: 16}}>
          		<View style={styles.settingBox}><CustomText style={styles.settingText}>소리 설정</CustomText></View>
          		<View style={styles.settingBox}><CustomText style={styles.settingText}>진동 설정</CustomText></View>
				<Pressable 
					onPress={() => {navigation.navigate('Quote')}} 
					style={styles.settingBox}
				>
					<CustomText style={styles.settingText}>글귀 설정</CustomText>
				</Pressable>
				<Pressable
					onPress={() => {navigation.navigate('BTS')}}
					style={styles.settingBox}
				>
					<CustomText style={styles.settingText}>방탄소년단 에디션</CustomText>
				</Pressable>
          		<Pressable
					onPress={() => {navigation.navigate('ILLIT')}}
					style={styles.settingBox}
				>
					<CustomText style={styles.settingText}>아일릿 에디션</CustomText>
				</Pressable>
			</View>
		</View>
		<Footer navigation={navigation}/>
    </Container>
  );
}


const styles = {
  settingBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  settingText: {
    fontSize: 20,
  }
};

export default Settings