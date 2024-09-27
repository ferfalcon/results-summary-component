(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();async function c(o){try{const t=await fetch(o);if(!t.ok)throw new Error(`HTTP error! statis: ${t.status} on ${o}`);return await t.json()}catch(t){throw console.log("Error fectching the JSON:",t),t}}function a(o){let t=document.createElement("div");document.querySelector("main").append(t);let n="";n+=`
		<p>${o.name}</p>
		<p>${o.age}</p>
		<p>${o.description}</p>
		<p>${o.age}</p>
	`,t.innerHTML+=n}const u="./data.json";c(u).then(o=>{a(o)});
