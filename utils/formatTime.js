export function formatSecondsToHM(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
  
	const parts = [];
	if (hours > 0) parts.push(`${hours}H`);
	if (minutes > 0 || hours === 0) parts.push(`${minutes}M`);
  
	return parts.join(' ');
}