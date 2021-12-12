const

isLeapYear = y => !(y % 4 || !(y % 100) && y % 400),

getStaticDate = (
	date,
	dayNames = [ '日', '月', '火', '水', '木', '金', '土' ],
	meridian = [ '午前', '午後' ]
) => {
	
	const data = {};
	
	data.source = date instanceof Date ? date : (date = new Date(date)),
	
	data.year = date.getFullYear(),
	data.month = date.getMonth(),
	data.hours = date.getHours(),
	data.mins = date.getMinutes(),
	data.secs = date.getSeconds(),
	data.msecs = date.getMilliseconds(),
	data.time = date.getTime(),
	
	data.dayName = Array.isArray(dayNames) ? dayNames[date.getDay()] : dayNames || null,
	data.meridian =
		Array.isArray(meridian) ? meridian[date.getHours() < 12 ? 0 : 1] : meridian || null;
	
	return data;
	
},

getElapse = (to = 0, from = new Date()) => {
	
	if ((to = getStaticDate(to)).time > (from = getStaticDate(from)).time) {
		const elapsed = getElapse(from.source, to.source);
		let k;
		for (k in elapsed) elapsed[k] = k === 'from' ? to : k === 'to' ? from : elapsed[k] === null ? elapsed[k] : -elapsed[k];
		return elapsed;
	}
	
	const	monthly = [], elapsed = { years: 0, months: -1, monthly, from, to };
	let i, daysCount, daysOfMonth, mo, isLeap, y;
	
	//daysCount = parseInt((elapsed.time = from.time - to.time) / 86400000),
	i = -1,
	daysCount = elapsed.totalDays = ((elapsed.time = from.time - to.time) / 1000 | 0) / 86400 | 0,
	daysOfMonth = 0, mo = from.month + 1, isLeap = !((y = from.year) % 4 || !(y % 100) && y % 400);
	while ((daysCount -= daysOfMonth) >= 0) {
		
		monthly[++i] = daysOfMonth =
			--mo === 1 ? isLeap ? 29 : 28 : mo === 3 || mo === 5 || mo === 8 || mo === 10 ? 30 : 31,
		
		mo === 0 && (mo = 12),
		
		++elapsed.months === 12 &&
			(++elapsed.years, elapsed.months = 0, isLeap = !(--y % 4 || !(y % 100) && y % 400));
		
	}
	
	elapsed.days = (monthly[i] += daysCount),
	elapsed.hours = from.hours < to.hours ? (24 - to.hours) + from.hours : from.hours - to.hours,
	elapsed.mins =
		from.mins < to.mins ? (--elapsed.hours, (60 - to.mins) + from.mins) : from.mins - to.mins,
	elapsed.secs =
		from.secs < to.secs ? (--elapsed.mins, (60 - to.secs) + from.secs) : from.secs - to.secs,
	elapsed.msecs =
		from.msecs < to.msecs ? (--elapsed.secs, (1000 - to.msecs) + from.msecs) : from.msecs - to.msecs,
	
	elapsed.years || (elapsed.years = null,
		elapsed.months || (elapsed.months = null,
			elapsed.days || (elapsed.days = null,
				elapsed.hours || (elapsed.hours = null,
					elapsed.mins || (elapsed.mins = null,
						elapsed.secs || (elapsed.secs = null,
							elapsed.msecs || (elapsed.msecs = null)))))));
	
	return elapsed;
	
};