export default async function fetchJsonData(Url) {
	try {
		const response = await fetch(Url);
		if(!response.ok) {
			throw new Error(`HTTP error! statis: ${response.status} on ${Url}`);
		}
		const dataJson = await response.json();
		return dataJson;
	}
	catch (error) {
		console.log('Error fectching the JSON:', error);
		throw error;
	}
}