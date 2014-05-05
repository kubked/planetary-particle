// timer
(function () {
	var clock = 0.0;
	var step = 200;
	setInterval(function() {
		clock += step/100.0;
		var event = new CustomEvent("clockTick", {"detail": clock});	
		document.dispatchEvent(event);
	}, step);
})();
