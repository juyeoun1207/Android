import React, {useState} from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput, View, Button } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import useQuoteZustand from '../../../store/useQuote';


const playQuoteAudio = (fileName) => {
  try {
    const nameWithoutExt = fileName.replace('.mp3', '');
    SoundPlayer.playSoundFile(nameWithoutExt, 'mp3'); // '파일명', '확장자'
  } catch (e) {
    console.log('오디오 재생 오류:', e);
  }
};

const Quote = ({ navigation }) => {
   const quoteList = useQuoteZustand((state) => state.quoteList);
   const defaultQuotes = quoteList.filter((item) => item.type === '기본');
   const currentQuote = useQuoteZustand((state) => state.selectedQuote);
   const setSelectedQuote = useQuoteZustand((state) => state.setSelectedQuote);

   const btsQuotes = quoteList.filter(item => item.type === 'BTS');
   const isBtsSelected = btsQuotes.some(item => item.text === currentQuote);
   const selectedBts = btsQuotes.find(item => item.text === currentQuote);

   const illitQuotes = quoteList.filter(item => item.type === 'ILLIT');
   const isIllitSelected = illitQuotes.some(item => item.text === currentQuote);
   const selectedIllit = illitQuotes.find(item => item.text === currentQuote);


   const [text, setText] = useState('')

   return (
		<KeyboardAvoidingView 
			style={{flex:1}}
			behavior={'height'}
			keyboardVerticalOffset={0}
		>
			<Container>
				<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>

					<Pressable onPress={() => navigation.navigate('Settings')}>
						<Icon name="arrow-back" size={30} color="#000" />
					</Pressable>

					<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
						<CustomText style={{ fontSize: 30 }}>글귀 설정</CustomText>
					</View>
            <ScrollView contentContainerStyle={{flexGrow:1, paddingBottom:20}}>
					<View>
						<CustomText style={{fontSize:20, marginBottom:15}}>기본 글귀</CustomText>
            {defaultQuotes.map((item, index) => (
            <Pressable
               key={index}
               onPress={() => {
                  playQuoteAudio(item.audio);
                  setSelectedQuote(item.text);
               }}
               style={{...styles.quoteBox, flexDirection: 'row', alignItems: 'center', marginBottom: 8,}}>
                  <View style={{width:32}}>
                  {currentQuote === item.text && (<Icon name="check" size={20} color="#333" />
                  )}
                  </View>
                  <CustomText style={{fontSize: 14}}>
                  {item.text}
                  </CustomText>
            </Pressable>
            ))}
            
            <View style={{ marginTop: 30 }}>
            <Pressable
               onPress={() => {navigation.navigate('BTS')}}
               style={styles.quoteBox}
            >
               <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', height:'100%' }}>
                  <View style={{flexDirection: 'row', height:'100%', alignItems: 'center'}}>
                     <View style={{width:32}}>
                        {isBtsSelected && (<Icon name="check" size={20} color="#333" />)}
                     </View>
                     <CustomText style={{fontSize:15}}>방탄소년단 에디션</CustomText>
                  </View>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                     {selectedBts && (
                     <CustomText style={{marginRight:10, fontSize:13, color:'#333'}}>
                        {selectedBts.name}
                     </CustomText>
                     )}
                     <SimpleIcon name="arrow-right" size={10} color="#333"/>
                  </View>
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
                        {isIllitSelected && (<Icon name="check" size={20} color="#333" />)}
                     </View>
                     <CustomText style={{fontSize:15}}>아일릿 에디션</CustomText>
                  </View>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                     {selectedIllit && (
                     <CustomText style={{marginRight:10, fontSize:13, color:'#333'}}>
                        {selectedIllit.name}
                     </CustomText>
                     )}
                     <SimpleIcon name="arrow-right" size={10} color="#333"/>
                  </View>
               </View>
            </Pressable>
            </View>

            <CustomText style={{fontSize:20, marginTop:50, marginBottom:15}}>직접 설정</CustomText>
               {/* 입력 박스 */}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					borderColor: '#ccc',
					borderWidth: 1,
					borderRadius: 8,
					padding: 12,
					height:50
				}}
			>
				<View style={{ width: 32, height:'100%' }}>
					{currentQuote === text.trim() && text.trim() !== '' && (
					<Icon name="check" size={20} color="#333" />
					)}
				</View>
				<TextInput
					style={{height:50,fontSize: 14 }}
					maxLength={20}
					placeholder="직접 입력해보세요"
					value={text}
					onChangeText={setText}
					onSubmitEditing={() => {
						if (text.trim()) {
							setSelectedQuote(text.trim());
							Tts.speak(text.trim());
						}
					}}
				/>
			</View>
			{/* 글자 수 카운터 */}
			<View style={{ alignItems: 'flex-end'}}>
				<CustomText style={{ fontSize: 13, color: '#888', marginRight:5}}>
					{text.length} / 20
				</CustomText>
			</View>

            </View>
            </ScrollView>
         </View>

			</Container>
	</KeyboardAvoidingView>
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

export default Quote