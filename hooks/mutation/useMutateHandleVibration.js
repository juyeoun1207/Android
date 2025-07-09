import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import {deleteAlarm, createAlarm} from '../../utils/handleAlarm'
const handleVibrationType = async({value, soundType, audio}) => {
	await deleteAlarm()
	await createAlarm(soundType === 'on' ? audio : 'default', value)
	await AsyncStorage.setItem('vibration_type', value ? 'on' : 'off')
	return {value}
}
const useMutateHandleVibration = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: handleVibrationType,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateHandleVibration