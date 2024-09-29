export default function printJsonObject(jsonObject) {
	writeHeading(jsonObject.title);
	writeTableTitle(Object.keys(jsonObject)[3]);

	let summaryItem = '';
	jsonObject.summary.forEach(item => {
		summaryItem += `
			<div>
				<dt>${item.category}</dt>
				<dd><b>${item.score}</b> / 100</dd>
			</div>
		`;
	});
	document.querySelector('[data-summary]').innerHTML = summaryItem;
}

function writeTableTitle(text) {
	document.querySelector('[data-summary-heading]').textContent = text;
}

function writeHeading(text) {
	document.querySelector('[data-heading]').textContent = text;
	
}