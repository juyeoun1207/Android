import React, {useState} from 'react'
import { Button, Pressable, Text, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useQuoteZustand from '../../../store/useQuote';

const playQuoteAudio = (fileName) => {
  try {
    const nameWithoutExt = fileName.replace('.mp3', '');
    SoundPlayer.playSoundFile(nameWithoutExt, 'mp3'); // '파일명', '확장자'
  } catch (e) {
    console.log('오디오 재생 오류:', e);
  }
};


const ILLIT = ({ navigation }) => {
  const quoteList = useQuoteZustand((state) => state.quoteList);
  const illitQuotes = quoteList.filter((item) => item.type === 'ILLIT');
  const currentQuote = useQuoteZustand((state) => state.selectedQuote);
  const setSelectedQuote = useQuoteZustand((state) => state.setSelectedQuote);

  return (
    <Container>
      <View style={{ flex:1, padding: '10%', width:'100%', backgroundColor:'#fff' }}>
        <Pressable onPress={() => navigation.navigate('Quote')}>
          <Icon name="arrow-back" size={30} color="#000" />
        </Pressable>

        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
          <CustomText style={{ fontSize: 30 }}>아일릿 에디션</CustomText>
        </View>

        <View style={{ gap: 10 }}>
          {illitQuotes.map((item, index) => (
            <View key={index}>
              <CustomText style={{fontSize:20}}>{item.name}</CustomText>
              <Pressable
                onPress={() => {
                  playQuoteAudio(item.audio);
                  setSelectedQuote(item.text);
                }}
              >
                <View style={{...styles.textBox, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width:32}}>
                    {currentQuote === item.text && (
                      <Icon name='check' size={24} color="#333"/>
                    )}
                  </View>
                  <CustomText style={{fontSize: 14}}>{item.text}</CustomText>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </Container>
  )
};



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