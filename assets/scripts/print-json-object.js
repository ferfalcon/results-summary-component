export default function printJsonObject(jsonObject) {
	writeHeading(jsonObject.title);
	writeComment(jsonObject.comment);
	writeJudgement(jsonObject.judgement);
	writeTableTitle(Object.keys(jsonObject)[3]);
	writeSummaryTable(jsonObject.summary);
	writeResult(calculateResult(jsonObject.summary));
}

function writeHeading(text) {
	const wrapper = document.querySelector('[data-heading]');
	wrapper.textContent = text;
}

function writeComment(text) {
	const wrapper = document.querySelector('[data-description]');
	wrapper.textContent = text;
}

function writeJudgement(text) {
	const wrapper = document.querySelector('[data-judgement]');
	wrapper.textContent = text;
}

function writeTableTitle(text) {
	const wrapper = document.querySelector('[data-summary-heading]');
	wrapper.textContent = text;
}

function writeSummaryTable(summaryData) {
	let summaryItem = ``;
	summaryData.forEach( item => {
		summaryItem += `
			<div class="results-summary__data-table-row">
				<dt>
					<img src="${item.icon}" alt="" height="20" width="20" />
					${item.category}
				</dt>
				<dd><b>${item.score}</b> / 100</dd>
			</div>
		`;
	});

	const wrapper = document.querySelector('[data-summary]');
	wrapper.innerHTML = summaryItem;
}

function calculateResult(summaryData) {
	const valuesQuantity = summaryData.length;
	let sumValue = 0;
	summaryData.forEach( item => {
		sumValue += item.score;
	});

	const num = Math.floor(sumValue/valuesQuantity);
	return num
}

function writeResult(num) {
	const wrapper = document.querySelector('[data-score]');
	wrapper.innerHTML = num;
}