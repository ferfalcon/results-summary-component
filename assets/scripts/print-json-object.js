export default function printJsonObject(jsonObject) {
	let wrapper = document.createElement("div");
	const main = document.querySelector('main');
	main.append(wrapper);

	// console.log(jsonObject)
	let item = '';
	item += `
		<p>${jsonObject.name}</p>
		<p>${jsonObject.age}</p>
		<p>${jsonObject.description}</p>
		<p>${jsonObject.age}</p>
	`;
	wrapper.innerHTML += item;
}