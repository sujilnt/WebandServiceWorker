"use strict";

// TODO
const version =2;

var  isOnline = true;
var isLoggedIn= false;

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message",onMessage);


main().catch(console.error);

//************************************************
async function sendMessage(msg){
	var allClients = await Clients.matchAll({
		includeUncontrolled: true
	});
	return Promise.all(
		allClients.map(function clientMsg(){
			var chan = new MessageChannel();
			chan.port1.onmessage = onMessage();
			return client.postMessage(msg,[chan.port2]);
			
		})
	)
}
function onMessage({data}){
	if(data.statusUpdate){
		({isOnline,isLoggedIn}= data.statusUpdate);
		console.log(`service worker ${version} status update isOnline ${isOnline} and is ${isLoggedIn}`)
	}
}
async function main(){
	await sendMessage({
		requestStatusUpdate: true
	});
	console.log(`server Worker (${version}) is starting `);
}
async function onInstall(evt){
	console.log(`server Worker (${version}) is installed `);
	self.skipWaiting();
}

function onActivate(evt){
	evt.waitUntil(handleActivation());
}
async function handleActivation(){
	await clients.claim();
	console.log(`server Worker (${version}) is activated `);
}


