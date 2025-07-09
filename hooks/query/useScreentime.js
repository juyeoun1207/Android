import { useQuery } from '@tanstack/react-query';
import UsageMonitor from '../../utils/UsageMonitorModule'
const getWeekInfo = (stats) => {
	const weekMap = []
	const appWeekMap = []
	const totalApp = []
	let largeTime = 0
	const dayTypeList = ["일","월","화","수","목","금","토"]
	dayTypeList.forEach(dayType => {
		let time = 0
		if(stats.weekly[dayType]){
			stats.weekly[dayType].map(({packageName, totalTimeInForeground}) => {
				time += Number(totalTimeInForeground || 0)
				if(!totalApp.some(e => e == packageName)) totalApp.push(packageName)
			})
		}
		if(time > largeTime) largeTime = time
		weekMap.push({dayType:dayType, time: time})
	})
	totalApp.map(pkgName => {
		let totalTime = 0
		let availableCnt = 0
		const item = {}
		dayTypeList.forEach(dayType => {
			let time = 0
			if(stats.weekly[dayType]){
				time = stats.weekly[dayType].filter(e => e.packageName == pkgName).reduce((a,b) => a+= Number(b.totalTimeInForeground || 0), 0)
				if(time > 0){
					totalTime += time
					availableCnt += 1
				}
			}
			item[dayType] = time
		})
		appWeekMap.push({pkg: pkgName, available_cnt: availableCnt, total_time: totalTime, week_time: item})
	})
	if(largeTime > 0){
		weekMap.map(data => {
			data.ratio = data.time * 100 / largeTime
		})
	}
	return {appPerWeekList: appWeekMap, weekList: weekMap}
}
const getAppList = (stats) => {
	const usageMap = []
	stats.today.forEach(item => {
		const pkg = item.packageName;
		const name = item.appName
		const icon = item.iconBase64
		const time = item.totalTimeInForeground || 0;
		const findIndex = usageMap.findIndex(e => e.pkg == pkg)
		if(findIndex != -1){
			usageMap[findIndex].time += time
		}
		else{
			usageMap.push({pkg: pkg, name: name,icon: icon, time: time})
		}
	})
	let largeTime = 0
	const mergedStats = usageMap.filter(e => e.pkg != "com.myfirstapp").sort((a,b) => {
		if(a.time > largeTime) largeTime = a.time
		if(b.time > largeTime) largeTime = b.time
		return b.time - a.time
	})
	mergedStats.map(data => {
		data.ratio = data.time * 90 / largeTime
		return data
	});
	return mergedStats
}
export const getScreentime = async() => {
	const stats = await UsageMonitor.getAppUsageStats();
	const appList = getAppList(stats)
	const {appPerWeekList, weekList} = getWeekInfo(stats)
	appList.map(data => {
		data.week_info = appPerWeekList.find(e => e.pkg == data.pkg)
	})
	return {appList, appPerWeekList, weekList}
}
const useScreentime = () => {
	return useQuery({
		queryKey: ["screentime"],
		queryFn: getScreentime,
	});
}

export default useScreentime