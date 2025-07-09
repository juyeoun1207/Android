import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { monthObj } from "../../utils/listItem";
const handleStar = async({selectedDate, pkg}) => {
	let photoArr = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
	let objectKey = 'day' + selectedDate.day
	photoArr[objectKey].forEach(data => {
		if(data.pkg == pkg) data.star = true
		else if(data.star) data.star = false
	})
	photoArr[objectKey].sort((a, b) => {
		return a.star ? -1 : 1
	})
	await AsyncStorage.setItem(`month-photo`, JSON.stringify(photoArr));
	return {images: photoArr[objectKey], map: photoArr}
}
const useMutateHandleStar = ({onSuccess}) => {
	
	return useMutation({
		mutationFn: handleStar,
        onSuccess:(data) => {
			if(onSuccess) onSuccess(data)
        }
    })
}
export default useMutateHandleStar