(function Blog(){
	"use strict";

	var offlineIcon;
	var isonline=("onLine" in navigator) ? navigator.onLine: true;
	var isLoggedIn = /isLoggedIn=1/.test(document.cookie.toString() || "");

	document.addEventListener("DOMContentLoaded",ready,false);


	// **********************************

	function ready() {
		offlineIcon = document.getElementById("connectivity-status");
		if(!isonline){
			offlineIcon.classList.remove("hidden");
		}
		window.addEventListener("online",function online() {
			offlineIcon.classList.add("hidden");
			isonline=true;
		});
		window.addEventListener("offline",function offline() {
			offlineIcon.classList.remove("hidden");
			isonline=false;
		});
	}

})();
