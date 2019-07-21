(function Blog(){
	"use strict";

	var offlineIcon;
	var isonline=("onLine" in navigator) ? navigator.onLine: true;
	var isLoggedIn = /isLoggedIn=1/.test(document.cookie.toString() || "");
	var usingSW = ("serviceWorker" in navigator);
	var swRegistration;
    var svcworker;
	document.addEventListener("DOMContentLoaded",ready,false);

    initServerWorker().catch(console.error);
	// **********************************

	function ready() {
		offlineIcon = document.getElementById("connectivity-status");
		if(!isonline){
			offlineIcon.classList.remove("hidden");
		}
		window.addEventListener("online",function online() {
			offlineIcon.classList.add("hidden");
			isonline=true;
			sendStatusUpdate();
		});
		window.addEventListener("offline",function offline() {
			offlineIcon.classList.remove("hidden");
			isonline=false;
			sendStatusUpdate();
		});
	}
	async function initServerWorker() {
		swRegistration = await navigator.serviceWorker.register("/sw.js",{
			updateViaCache: "none"
		});
		svcworker = swRegistration.installing || swRegistration.waiting || swRegistration.active;
		navigator.serviceWorker.addEventListener("controllerchange", function onControllerChange(){
			svcworker = navigator.serviceWorker.controller;
			sendStatusUpdate(svcworker);
		});
		navigator.serviceWorker.addEventListener("message",onSWMessage);
		
	}
	async function onSWMessage(){
		var {data} =evt;
		console.log("dataaaaaaaa",data);
		if(data.requestStatusUpdate){
		
			console.log(`received status update request from service worker`);
			sendStatusUpdate(evt.ports && evt.ports[0]);
		}
	}
	function sendStatusUpdate(target){
		sendSWMessage({ statusUpdate: {isonline,isLoggedIn} },target)
	}
	async function sendSWMessage(msg,target) {
		if(target){
			target.postMessage(msg);
		}else if(svcworker){
			svcworker.postMessage(msg)
		} else{
			navigator.serviceWorker.controller.postMessage(msg);
		}
	}
})();
