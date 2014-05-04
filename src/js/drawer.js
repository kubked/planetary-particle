function Drawer (canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");

	this.view = {
		x: 0, // center position
		y: 0, // center position
		range: 3500000000.0, // half of shortest dimension (width/height)
	};

	this.planetScale = 1000;

}

Drawer.prototype.translateDistance = function (distance) {
	return Math.min(this.canvas.width, this.canvas.height) / (2 * this.view.range) * distance * this.planetScale;
};

Drawer.prototype.translatePosition = function (position) {
	var scaledDimension = Math.min(this.canvas.width, this.canvas.height);
	return {
		// todo: this.view.x and y
		x: ((this.view.range * this.canvas.width/scaledDimension) + position.x - this.view.x)/(this.view.range*2*this.canvas.width/scaledDimension) * this.canvas.width,
		y: ((this.view.range * this.canvas.height/scaledDimension) + position.y - this.view.y)/(this.view.range*2*this.canvas.height/scaledDimension) * this.canvas.height
	}
};

Drawer.prototype.repaint = function () {
	var position;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
	this.context.fillStyle = "#FF0000";

	for(var name in planets)
	{
		if (planets.hasOwnProperty(name))
		{
			position = model.getPlanetPosition(planets[name]);
			position = this.translatePosition(position);
			var radius = Math.max(2, this.translateDistance(planets[name].radius));
			//temp
			this.context.beginPath();
			this.context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
			this.context.fill();
		}
	}

	// Draw star in center:
	this.context.fillStyle = "#FFFF00";
	position = this.translatePosition({x:0, y:0});
	var radius = Math.max(4, this.translateDistance(6960.0 * 5))
	//temp
	this.context.beginPath();
	this.context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
	this.context.fill();
};

Drawer.prototype.zoom = function (delta) {
	this.view.range *= delta == 1 ? 1.1 : 0.9;
};

Drawer.prototype.translateSpace = function (position) {
	var scaledDimension = Math.min(this.canvas.width, this.canvas.height);
	this.view.x += position.x * (this.view.range*2)/(this.canvas.height);
	this.view.y += position.y * (this.view.range*2)/(this.canvas.width);
};

var drawer;

function MouseWheelHandler (e) {
	if (drawer.constructor == Drawer) {
		// http://www.sitepoint.com/html5-javascript-mouse-wheel/
		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		drawer.zoom(delta);
	}
}

window.onload = function () {
	var canvas = document.getElementById("planetary-canvas");
	// add mouse wheel handler
	if (canvas.addEventListener) {
		// IE9, Chrome, Safari, Opera
		canvas.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
		canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	// IE 6/7/8
	else canvas.attachEvent("onmousewheel", MouseWheelHandler);

	// move canvas
	canvas.addEventListener("mousedown",mousedown);
	canvas.addEventListener("mousemove",mousemove);
	canvas.addEventListener("mouseup",mouseup);

	//and some vars to track the dragged item
	var dragIdx = -1;
	var startX, startY;

	function mousedown(e){
	    startX = canvas.offsetLeft - e.layerX;
	    startY = canvas.offsetTop - e.layerY;
	    dragIdx = 1;
	}

	function mousemove(e) {
	    if (dragIdx != -1) {
		    var mouseX = canvas.offsetLeft - e.layerX;
		    var mouseY = canvas.offsetTop - e.layerY;
		    var diffX = mouseX - startX;
		    var diffY = mouseY - startY;
		    startX = mouseX;
		    startY = mouseY;
		    
		    drawer.translateSpace({x: diffX, y: diffY});
		}
	}

	function mouseup(e) {
	     dragIdx = -1;
	}


	drawer = new Drawer(canvas);

	setInterval(function () {
		model.time += 0.5;
		drawer.repaint();
	}, 30);
};