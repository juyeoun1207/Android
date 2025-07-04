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