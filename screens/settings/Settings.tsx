import { Button, Pressable, Text, View, Switch } from 'react-native';
import soundTypeZustand from '../../store/soundType'
import vibrationTypeZustand from '../../store/vibrationType'
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import Footer from '../../components/Footer'
import useQuoteZustand from '../../store/useQuote';

const Settings = ({ navigation }) => {
  const soundType = soundTypeZustand((state) => state.soundType);
  const setSoundType = soundTypeZustand((state) => state.setSoundType);
  const vibrationType = vibrationTypeZustand((state) => state.vibrationType);
  const setVibrationType = vibrationTypeZustand((state) => state.setVibrationType);
  const currentQuote = useQuoteZustand((state) => state.selectedQuote);
  const quoteList = useQuoteZustand((state) => state.quoteList);
  const selectedQuoteObj = quoteList.find((q) => q.text === currentQuote);

  return (
    <Container>
      	<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>
        	<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          	<CustomText style={{ fontSize: 30 }}>알림 설정</CustomText></View>
			
			<View style={{gap: 16}}>
          		<View style={styles.settingBoxRow}>
					<CustomText style={styles.settingText}>소리 설정</CustomText>
					<Switch
						value={soundType === 'on'}
						onValueChange={(value) => setSoundType(value ? 'on' : 'off')}
						trackColor={{ false: '#ccc', true: '#65C466'}}
						thumbColor={soundType === 'on' ? "#fff" : "#f4f3f4"}
					/>
				</View>
          		<View style={styles.settingBoxRow}>
					<CustomText style={styles.settingText}>진동 설정</CustomText>
					<Switch
						value={vibrationType === 'on'}
						onValueChange={(value) => setVibrationType(value ? 'on' : 'off')}
						trackColor={{false:"#ccc", true:"#65C466"}}
						thumbColor={vibrationType === 'on' ? "#fff" : "#f4f3f4"}
					/>
				</View>
				<Pressable 
					onPress={() => {navigation.navigate('Quote')}} 
					style={styles.settingBox}
				>
					<CustomText style={styles.settingText}>글귀 설정</CustomText>
				</Pressable>
				
				<CustomText style={{...styles.settingText, marginTop:10}}>현재 글귀</CustomText>
        <View style={styles.selectedQuoteBox}>
          <View>
            <CustomText style={styles.selectedQuoteText}>{currentQuote}</CustomText>
          </View>
        </View>
        {selectedQuoteObj && (
          <View style={{alignItems: 'flex-end', marginTop: -10, marginRight: 15}}>
            <CustomText style={{fontSize: 12, color: '#666'}}>
              {selectedQuoteObj.type} ({selectedQuoteObj.name})
            </CustomText>
          </View>
        )}

        
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
  settingBoxRow: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedQuoteBox: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 20,
  },
  selectedQuoteText: {
	fontSize: 15
  },
};

export default Settings