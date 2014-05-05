function Drawer (canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");

	this.view = {
		x: 0, // center position
		y: 0, // center position
		range: 3500000000.0, // half of shortest dimension (width/height)
	};

	this.planetScale = 500;

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

Drawer.prototype.getRotatedVectorPoint = function (point, center, angle) {
	// temp
	return {x: center.x + point.x, y: center.y + point.y}
};

Drawer.prototype.paintShip = function (position, angle, color1, color2) {
	var p1, p2, p3;
    // Draw saucer bottom.
    this.context.beginPath();
    // top
    p1 = this.getRotatedVectorPoint({x: 0, y: -20}, position, angle)
    this.context.moveTo(p1.x, p1.y);
    // top left angle
    p1 = this.getRotatedVectorPoint({x: -20, y: -15}, position, angle)
    p2 = this.getRotatedVectorPoint({x: -20, y: 0}, position, angle)
    p3 = this.getRotatedVectorPoint({x: -10, y: 0}, position, angle)
    this.context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    //bottom left angle
    p1 = this.getRotatedVectorPoint({x: -20, y: -15}, position, angle)
    p2 = this.getRotatedVectorPoint({x: -20, y: 0}, position, angle)
    p3 = this.getRotatedVectorPoint({x: -10, y: 0}, position, angle)
    this.context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    this.context.closePath();
    this.context.fillStyle = "rgb(222, 103, 0)";
    this.context.fill();

    // Draw saucer top.
    this.context.beginPath();
    this.context.moveTo(22.3, 12.0);
    this.context.bezierCurveTo(22.3, 13.3, 19.4, 14.3, 15.9, 14.3);
    this.context.bezierCurveTo(12.4, 14.3, 9.6, 13.3, 9.6, 12.0);
    this.context.bezierCurveTo(9.6, 10.8, 12.4, 9.7, 15.9, 9.7);
    this.context.bezierCurveTo(19.4, 9.7, 22.3, 10.8, 22.3, 12.0);
    this.context.closePath();
    this.context.fillStyle = "rgb(51, 190, 0)";
    this.context.fill();
}

Drawer.prototype.repaint = function () {
	var position;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

	for(var name in planets)
	{
		if (planets.hasOwnProperty(name))
		{
			position = model.getPlanetPosition(planets[name]);
			position = this.translatePosition(position);
			this.context.fillStyle = planets[name].color;
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

	this.paintShip({x: 100, y: 100}, 0, "rgb(222, 103, 0)", "rgb(51, 190, 0)");
};

Drawer.prototype.zoom = function (delta) {
	this.view.range *= delta == 1 ? 0.9 : 1.1;
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
		drawer.repaint();
	}, 30);
};