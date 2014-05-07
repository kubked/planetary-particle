var STANDBY_TURN = true,
    STANDBY_MOVE = true,
    MAP_BOUNDARIES = 250000000, // 3 500 000 000
    MOVE_DIFF = 2000000,
    TURN_DIFF = 0.1,
    MOVE_NOISE = 0.05 * MOVE_DIFF,
    TURN_NOISE = 0.1 * TURN_DIFF,
    STAND_TURN_NOISE = 0.005;
    SENSE_NOISE = 10000000; //  100 000 000

function Robot(x, y, angle, standby_actions){
    this.x = x;
    this.y = y;
    this.gravity_x = 0;
    this.gravity_y = 0;
    this.angle = angle;
    this.standby_actions = standby_actions || false;
}

Robot.prototype.move = function(e){
    var keys = e.detail.keys, dist, turn, new_x=this.x, new_y=this.y;

    // turn
    if(keys.left || keys.right){
        turn = (this.angle + TURN_DIFF * (keys.right ? 1 : -1) + randomNormal(0, TURN_NOISE)) % 1;
        this.angle = turn;
    }
    else if(this.standby_actions && STANDBY_TURN){
        turn = (this.angle + randomNormal(0, STAND_TURN_NOISE)) % 1;
        this.angle = turn;
    }

    // move
    if(keys.up || keys.down){
        dist = (keys.down ? -1 : 1) * (MOVE_DIFF + randomNormal(0, MOVE_NOISE));
        new_y = this.y - Math.cos(this.angle * 2 * Math.PI) * dist;
        new_x = this.x + Math.sin(this.angle * 2 * Math.PI) * dist;
    }
    else if(this.standby_actions && STANDBY_MOVE){
        dist_x = randomNormal(0, MOVE_NOISE);
        dist_y = randomNormal(0, MOVE_NOISE);
        new_x = this.x + dist_x;
        new_y = this.y + dist_y;
    }

    if(model.isPossiblePosition({x: new_x, y: new_y})){
        this.x = new_x;
        this.y = new_y;
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
