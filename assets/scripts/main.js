import '../styles/style.css';
import loadData from './asyn-fetch-json-data';
import printObjectData from './print-json-object';

const dataUrl = './data.json';

loadData(dataUrl)
.then (data => {
	printObjectData(data);
	// console.table(data);
})
