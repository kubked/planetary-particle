function Model () {
	this.time = 0.0; // in days
	var obj = this;
	document.addEventListener("clockTick", function(ev) {
	  obj.setTime(ev.detail); // Prints "Example of an event"
	});
}

Model.prototype.getPlanetPosition = function (planet, time) {
	time = time || this.time;
	var angle = time / (planet.period * 365);
	angle = angle - Math.floor(angle); // normalize to 0-1
	return {
		x: Math.cos(2 * Math.PI * angle) * planet.starDistance,
		y: Math.sin(2 * Math.PI * angle) * planet.starDistance
	}
}

Model.prototype.setTime = function (time) {
	this.time = time;
}

var model = new Model();


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
