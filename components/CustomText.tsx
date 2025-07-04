import { Text, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
	text: {
		fontFamily:'DungGeunMo'
	}
})
const CustomText = ({ children, style, ...props }) => {
  return (
    <Text style={{...styles.text, ...style}}>{children}</Text>
  );
}
export default CustomText