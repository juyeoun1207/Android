import { useQuery } from '@tanstack/react-query';
import UsageMonitor from '../../utils/UsageMonitorModule'
import formatSecondsToHM from '../../utils/formatTime'
export const getAppTimeLimit = async(pkg) => {
	const data = await UsageMonitor.getUsageThreshold(pkg);
	return data
}
const useAppTimeLimit = ({enabled, pkg}) => {
	return useQuery({
		queryKey: ["screentime_limit"],
		queryFn: () => getAppTimeLimit(pkg),
		enabled: enabled
	});
}

export default useAppTimeLimit