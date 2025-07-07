import React, {useState} from 'react'
import { Button, TextInput, View, Pressable } from 'react-native';
import Container from '../../components/Container'
import CustomText from '../../components/CustomText';
import Footer from '../../components/Footer'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

const appList=[
  {name:'instagram', id:1},
  {name:'kakaotalk', id:2},
  {name:'youtube', id:3},
  {name: 'naver blog', id:4},
]

const Home = ({ navigation }) => {
  return (
    <Container>
		<View style={{display:'flex',width:'100%', flex:1, paddingTop:'10%'}}>
      		<View style={{height:'50%', paddingBottom:10, width:'100%', alignItems:'center', display:'flex', paddingLeft:'10%', paddingRight:'10%'}}>
				<CustomText style={{fontSize:25, marginTop:10, marginBottom:20}}>7월 성공률 : 30%</CustomText>
				<View style={{width:'100%',marginTop:10,display:'flex', flex:1, backgroundColor:'lightgray'}}></View>
			</View>
      		<View style={{height:'50%'}}>
				<Pressable
					onPress={() => {navigation.navigate('instagram')}}>
					<View style={{height:50, width:'100%', marginTop:20}}>
						<View style={{gap:15}}>
							{appList.map((data, index) => {
								return (
									<View style={{...styles.appListBox, marginLeft:20, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
										<CustomText style={{fontSize:20}}>{data.name}</CustomText>
										<SimpleIcon name="arrow-right" size={10} color="#333"/>
									</View>
								)
							})}
						</View>
							
					</View>
				</Pressable>
			</View>
		</View>
		<Footer navigation={navigation}/>
    </Container>
  );
}

const styles = {
  appListBox: {
    width: '90%',
	height: '40%',
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  }
}

export default Home
