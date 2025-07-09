import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
const handleQuote = async(item) => {
	await AsyncStorage.setItem('quote', item.text)
	return item
}
const useMutateHandleQuote = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: handleQuote,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateHandleQuote