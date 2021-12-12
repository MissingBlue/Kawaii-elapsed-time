addEventListener(
'load',

event => {

const

TO = '2019-12-12T09:00',
FROM = undefined,

INTERVAL = 33,

createInstance = (to, from, parent) => {
	
	const	node = document.createElement('div'),
			elapse = document.createElement('span'),
			run = document.createElement('button'),
			sync = document.createElement('button'),
			updateContent = () => (text = update(to, from).replace(/^\s*$/, 'now'), elapse.textContent = ` is 🗓 ${text === 'now' ? text : text + ' ago'} from `);
	let text;
	
	(to = createInput(to, node)).input.addEventListener('updated', updateContent),
	(from = createInput(from, node)).input.addEventListener('updated', updateContent),
	
	run.type = 'button',
	run.textContent = run.dataset.standby = '⏱ Run',
	run.dataset.running = '🛑 Pause',
	run.addEventListener('click', () => to.input.dataset.run ? (clearInterval(to.input.dataset.run), delete to.input.dataset.run, run.textContent = run.dataset.standby, sync.disabled = false) : (sync.disabled = true, to.begin = Date.now(), to.input.dataset.run = setInterval(updateContent, INTERVAL), run.textContent = run.dataset.running)),
	
	sync.type = 'button',
	sync.textContent = sync.dataset.standby = '🔄 Sync',
	sync.dataset.running = '🛑 Suspend',
	sync.addEventListener('click', () => to.input.dataset.sync ? (clearInterval(to.input.dataset.sync), delete to.input.dataset.sync, sync.textContent = sync.dataset.standby, run.disabled = false) : (run.disabled = true, to.input.dataset.sync = setInterval(updateContent, INTERVAL), sync.textContent = sync.dataset.running)),
	
	node.append(to.node, elapse, from.node, run,sync),
	ctrlNode.after(node),
	
	updateContent();
	
},
update = (to, from, elapse) => {
	
	to.input.dataset.sync ? (from.input.value = getValue(from.date = new Date())) :
		to.input.dataset.run && (
				from.date.setTime(from.date.getTime() + Date.now() - to.begin),
				to.begin = Date.now(),
				from.input.value = getValue(from.date)
			);
	
	const { years, months, days, hours, mins, secs, msecs } = elapsed = getElapse(to.date, from.date);
	
	to.input.dataset.sync || to.input.dataset.run || console.info(to, from, elapsed);
	
	return	(years === null ? '' : years + ' years ') +
				(months === null ? '' : (''+months).padStart(2, '0') + ' months ') +
				(days === null ? '' : (''+days).padStart(2, '0') + ' days ') +
				(hours === null ? '' : (''+hours).padStart(2, '0') + ' hours ') +
				(mins === null ? '' : (''+mins).padStart(2, '0') + ' mins ') +
				(secs === null ? '' : (''+secs).padStart(2, '0') + ' secs ') +
				(msecs === null ? '' : (''+msecs).padStart(3, '0') + ' ms');
	
},
createInput = (date = new Date(), parent) => {
	
	const result = {
							node: document.createElement('span'),
							input: document.createElement('input'),
							now: document.createElement('button'),
							date: date instanceof Date ? date : new Date(date)
						};
	
	result.input.type = 'datetime-local',
	result.input.value = getValue(result.date),
	result.input.addEventListener('change', event => (
			result.date = new Date(event.target.value),
			result.input.dispatchEvent(new CustomEvent('updated'))
		)),
	
	result.now.type = 'button',
	result.now.textContent = '👈 Now',
	result.now.addEventListener(
			'click',
			event => (
					result.input.value = getValue(result.date = new Date()),
					result.input.dispatchEvent(new CustomEvent('updated'))
				)
		),
	
	result.node.append(result.input, result.now),
	parent instanceof HTMLElement && parent.append(result.node);
	
	return result;
	
},
getValue = date => `${date.getFullYear()}-${(''+ (date.getMonth() + 1)).padStart(2,'0')}-${(''+date.getDate()).padStart(2,'0')}T${(''+date.getHours()).padStart(2,'0')}:${(''+date.getMinutes()).padStart(2,'0')}`,

ctrlNode = document.createElement('div'),
createInstanceButton = document.createElement('button');

createInstanceButton.type = 'button',
createInstanceButton.textContent = '🆕 Add',
createInstanceButton.addEventListener('click', () => createInstance(TO, FROM)),

ctrlNode.appendChild(createInstanceButton),

document.body.appendChild(ctrlNode),

createInstance(TO, FROM);

},

{ once: true });