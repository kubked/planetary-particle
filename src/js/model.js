function Model () {
	this.time = 0.0; // in days
	var obj = this;
	document.addEventListener("clockTick", function(ev) {
	  obj.setTime(ev.detail.clock); // Prints "Example of an event"
	});
}

Model.prototype.getPlanetPosition = function (planet) {
	var angle = this.time / (planet.period * 365);
	angle = angle - Math.floor(angle); // normalize to 0-1
	return {
		x: Math.cos(2 * Math.PI * angle) * planet.starDistance,
		y: Math.sin(2 * Math.PI * angle) * planet.starDistance
	}
}

Model.prototype.setTime = function (time) {
	this.time = time;
}

Model.prototype.isPossiblePosition = function (position) {
	for(var name in planets)
	{
		if (planets.hasOwnProperty(name))
		{
			if (distance(this.getPlanetPosition(planets[name]), position) < planets[name].radius) {
				return false;
			}
		}
	}
	return true;
}

Model.prototype.angle = function(point1, point2){
	var dx = point1.x - point2.x,
		dy = point1.y - point2.y,
		angle = Math.atan2(dx, dy) / (2 * Math.PI);
	if(angle < 0){
		angle = 1 + angle;
	}
	return 1 - angle;
}

Model.prototype.getPlanetsInRadarRange = function(position, angle, radarRange, radarAngle){
	var planetsInRange = [], dist, planetPosition, planetAngle, angleLeft, angleRight;
	for(var name in planets)
	{
		if (planets.hasOwnProperty(name))
		{
			planetPosition = this.getPlanetPosition(planets[name]);
			dist = distance(planetPosition, position);
			planetAngle = this.angle(position, planetPosition);
			angleLeft = angle - radarAngle;
			if(angleLeft < 0){
				angleLeft += 1;
			}
			angleRight = angle + radarAngle;
			if (dist < radarRange && planetAngle > angleLeft && planetAngle < angleRight) {
				planetsInRange.push(planets[name]);
			}
		}
	}
	return planetsInRange;
}

function distance(point1, point2) {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

var model = new Model();
