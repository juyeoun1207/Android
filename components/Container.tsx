import { Text, Image,Pressable, View, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#fff",
		justifyContent: 'center',
		alignItems:'center'
	}
})
const Container = ({ children, style, ...props }) => {
  return (
    <View style={{...styles.container, ...style}}>{children}</View>
  );
}
export default Container
//flex-direction: column #default
// justifyContent: 세로방향, flex-start, flex-end, center, space-between, space-around, space-evenly
//alignItems: 가로방향
//flex-direction: row #default
// justifyContent: 가로방향
//alignItems: 세로방향