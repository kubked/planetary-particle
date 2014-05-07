// timer
(function () {
	var clock = Math.random() * 1000;
	var step = 400;

	var up = false, down = false, left = false, right = false;

	window.onkeydown = function (ev) {
		if (ev.keyCode == 37)
			left = true;
		if (ev.keyCode == 38)
			up = true;
		if (ev.keyCode == 39)
			right = true;
		if (ev.keyCode == 40)
			down = true;
	}

	window.onkeyup = function (ev) {
		if (ev.keyCode == 37)
			left = false;
		if (ev.keyCode == 38)
			up = false;
		if (ev.keyCode == 39)
			right = false;
		if (ev.keyCode == 40)
			down = false;
	}

	setInterval(function() {
		clock += step/100.0;

		var event = new CustomEvent("clockTick",
			{
				"detail": {
					"clock": clock,
					"keys": {
						"up": up,
						"down": down,
						"left": left,
						"right": right
					}
				}
			}
		);
		document.dispatchEvent(event);
	}, step);
})();
