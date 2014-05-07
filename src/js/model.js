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


function distance(point1, point2) {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function vectorAdd(vector1, vector2) {
	return {x: vector1.x + vector2.x, y: vector1.y + vector2.y};
}

function vectorSub(vector1, vector2) {
	return {x: vector1.x - vector2.x, y: vector1.y - vector2.y};
}

function vectorNormalize(vector) {
	if (vector.x == 0) {
		return {x:0, y:1};
	} else {
		return {x: vector.x/(vector.x + vector.y), y: vector.y/(vector.x + vector.y)};
	}
}

function vectorScale(vector, scale) {
	return {x: vector.x * scale, y: vector.y * scale};
}

Model.prototype.getGravityInfluence = function (point, mass) {
	// mass is real_mass * 0.001/earth_mass
	var gravity = {x: 0, y: 0}, r, val, vector, planet;
	for(var name in planets)
	{
		if (planets.hasOwnProperty(name))
		{
			planet = this.getPlanetPosition(planets[name])
			r = distance(planet, point);
			val = (mass * planets[name].mass)/Math.pow(r, 2);
			vector = vectorNormalize(vectorSub(planet, point));
			gravity = vectorAdd(gravity, vectorScale(vector, val));
		}
	}
	return gravity;
}


var model = new Model();
