import React, {useState} from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput, View } from 'react-native';
import Container from '../../../components/Container'
import CustomText from '../../../components/CustomText';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

const defaultQuotes = [
  {text:'잠시 잊은 할 일 없었나요?'},
  {text:'다시 집중할 시간입니다.'},
  {text:'지금 이 순간을 담아보면 어떨까요?'}
];


const Quote = ({ navigation }) => {
   const [text, setText] = useState('')
   const [currentQuote, setCurrentQuote] = useState('');
   return (
	<KeyboardAvoidingView 
		style={{flex:1}}
		behavior={'height'}
		keyboardVerticalOffset={0}
	>
		<ScrollView contentContainerStyle={{flexGrow:1}}>
			<Container>
				<View style={{ flex:1, padding: '10%', width: '100%' , backgroundColor:'#fff'}}>

					<Pressable onPress={() => navigation.navigate('Settings')}>
						<Icon name="arrow-back" size={30} color="#000" />
					</Pressable>

					<View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50 }}>
						<CustomText style={{ fontSize: 30 }}>글귀 설정</CustomText>
					</View>

					<View>
						<CustomText style={{fontSize:20, marginBottom:15}}>기본 글귀</CustomText>

						{defaultQuotes.map((item, index) => (
						<Pressable
						key={index}
						onPress={() => {
							Tts.speak(item.text);
							setCurrentQuote(item.text);
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
		</ScrollView>
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