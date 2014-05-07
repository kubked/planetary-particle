var MAP_BOUNDARIES = 250000000, // 3 500 000 000
    MOVE_DIFF = 2000000,
    TURN_DIFF = 0.05,
    MOVE_NOISE = 0.05,
    TURN_NOISE = 0.01,
    SENSE_NOISE = 10000000; //  100 000 000

function Robot(x, y, angle){
    this.x = x;
    this.y = y;
    this.gravity_x = 0;
    this.gravity_y = 0;
    this.angle = angle;
}

Robot.prototype.move = function(e){
    var keys = e.detail.keys, dist, turn;

    // turn
    if(keys.left || keys.right){
        turn = (this.angle + TURN_DIFF * (keys.right ? 1 : -1) + randomNormal(0, TURN_NOISE)) % 1;
        this.angle = turn;
    }
    // move
    if(keys.up || keys.down){
        dist = MOVE_DIFF + randomNormal(0, MOVE_NOISE);
        this.y = this.y - Math.cos(this.angle * 2 * Math.PI) * dist;
        this.x = this.x + Math.sin(this.angle * 2 * Math.PI) * dist;
    }
}

Robot.prototype.gravity = function(gravity_x, gravity_y){
    this.gravity_x = x;
    this.gravity_y = y;
}

Robot.prototype.sense = function(){
    var distances = [], dist, planet_position;
    for(var name in planets){
        if (planets.hasOwnProperty(name)){
            planet_position = model.getPlanetPosition(planets[name]);
            dist = Math.sqrt(Math.pow(this.x - planet_position.x, 2) + Math.pow(this.y - planet_position.y, 2))
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

function gaussian(mu, sigma, x){
    return Math.exp(-(Math.pow(mu - x, 2)) / (Math.pow(sigma, 2)) / 2.0) / Math.sqrt(2.0 * Math.PI * Math.pow(sigma, 2));
}


var robot = new Robot(
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    Math.random()
);

document.addEventListener("clockTick", function(e){
    //robot.move.call(robot, e);
});
