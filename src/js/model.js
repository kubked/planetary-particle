var model = {
	time: 0.0, // in days
	getPlanetPosition: function (planet) {
		var angle = this.time / (planet.period * 365);
		angle = angle - Math.floor(angle); // normalize to 0-1
		return {
			x: Math.cos(2 * Math.PI * angle) * planet.starDistance,
			y: Math.sin(2 * Math.PI * angle) * planet.starDistance
		}
	}
};
