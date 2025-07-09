import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import {deleteAlarm, createAlarm} from '../../utils/handleAlarm'
const handleSoundType = async({value, vibrationType, audio}) => {
	await deleteAlarm()
	await createAlarm('alarm', value ? audio : 'default', vibrationType === 'on')
	await AsyncStorage.setItem('sound_type', value ? 'on' : 'off')
	return {value}
}
const useMutateHandleSound = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: handleSoundType,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateHandleSound