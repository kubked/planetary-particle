var MAP_BOUNDARIES = 3500000000,
    MOVE_DIFF = 5,
    TURN_DIFF = 0.05,
    MOVE_NOISE = 0.05,
    TURN_NOISE = 0.01,
    SENSE_NOISE = 0.05;

function Robot(x, y, angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    document.addEventListener("clockTick", this.move);
}

Robot.prototype.destroy = function(){
    document.removeEventListener("clockTick", this.move);
}

Robot.prototype.move = function(e){
    var keys = e.detail.keys, dist;
    console.log("move", keys);

    // turn
    if(keys.left || keys.right){
        this.angle = (this.angle + TURN_DIFF * (keys.right ? 1 : -1) + randomNormal(0, TURN_NOISE)) % 1;
    }

    else if(keys.up || keys.down){
        dist = MOVE_DIFF + randomNormal(0, MOVE_NOISE);
        this.x = this.x + Math.cos(this.angle * 2 * Math.PI) * dist;
        this.y = this.y + Math.sin(this.angle * 2 * Math.PI) * dist;
    }
}

Robot.prototype.sense = function(){
    var distances = [], dist, planet_position;
    for(var name in planets)
    {
        if (planets.hasOwnProperty(name))
        {
            planet_position = model.getPlanetPosition(planets[name]);
            dist = Math.sqrt(Math.pow(this.x - planets_position.x, 2) + Math.pow(this.y - planets_positions.y, 2))
            dist += randomNormal(0, SENSE_NOISE);
            distances.push(dist);
        }
    }
    return distances;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomNormal(mean, std) {
  var val = Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
  return (val * std) + mean;
}


var robot = new Robot(
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    Math.random()
);
