import AsyncStorage from '@react-native-async-storage/async-storage'
import {formatSecondsToHM} from './formatTime'
import { monthObj } from './listItem'
import {getWeekDate} from './getWeekDate'
import { weekList } from './listItem'
export const getWeekSuccessRate = (week) => {
	return `이번 주 성공률 : ${week.filter(e => e.state == 'success').length > 0 ? (week.filter(e => e.state == 'success' || e.state == 'fail').length * 100/ week.filter(e => e.state == 'success' || e.state == 'fail').length).toFixed(2) : 0}%`
}

export const getWeekAvgTime = (appData) => {
	return `이번 주 평균 이용 시간 : ${appData?.week_info?.available_cnt > 0 ? formatSecondsToHM(appData.week_info.total_time / appData.week_info.available_cnt) : '0H'}`
}
export const getWeekSuccessList = async(setWeek, setLoading) => {
	const monthPhoto = JSON.parse(await AsyncStorage.getItem('month-photo')) || {...monthObj}
	const weekDates = getWeekDate()
	const item = []
	weekDates.forEach((date, index) => {
		let objectKey = 'day' + date
		if(date > new Date().getDate()){
			item.push({name:weekList[index],state:'not_yet'})
		}
		else{
			const findIndex = monthPhoto[objectKey].findIndex(e => e.pkg == appData.pkg)
			if(findIndex != -1){
				if(monthPhoto[objectKey][findIndex].path) item.push({name:weekList[index],state:'success'})
				else item.push({name:weekList[index],state:'fail'})
			}
			else item.push({name:weekList[index],state:'not_alarmed'})
		}
	})
	setWeek(item)
	setLoading(false)
}