import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import vibrationTypeZustand from "../../store/vibrationType";
import { deleteAlarm, createAlarm } from "../../utils/handleAlarm";
const handleQuote = async(item) => {
	const audioName = item?.audio?.replace('.mp3', '') || 'default'
	await deleteAlarm()
	await createAlarm(audioName, vibrationTypeZustand.getState().vibrationType === 'on')
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