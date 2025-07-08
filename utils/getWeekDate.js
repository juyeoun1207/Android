export function getWeekDate(){
	const today = new Date();
	const dayOfWeek = today.getDay(); // 0 (일) ~ 6 (토)
  
	const sunday = new Date(today);
	sunday.setDate(today.getDate() - dayOfWeek); // 이번 주 일요일로 이동
  
	const weekDates= [];
  
	for (let i = 0; i < 7; i++) {
	  const date = new Date(sunday);
	  date.setDate(sunday.getDate() + i);
	  weekDates.push(date.getDate());
	}
  
	return weekDates;
  }