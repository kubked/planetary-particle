var STANDBY_TURN = true,
    STANDBY_MOVE = true,
    ROBOT_MASS = 10000000000000,
    ENGINE_ACCELERATION = 100000,
    TICK_TIME = 1,
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
    this.angle = angle;
    this.speed = {x: 0, y: 0};
    this.standby_actions = standby_actions || false;
}

Robot.prototype.move = function(e){
    var keys = e.detail.keys, dist, turn = 0, new_x=this.x, new_y=this.y, dist_x=0, dist_y=0;

    // turn
    if(keys.left || keys.right){
        turn = TURN_DIFF * (keys.right ? 1 : -1) + randomNormal(0, TURN_NOISE);
        // this.angle = turn;
    }
    else if(this.standby_actions && STANDBY_TURN){
        turn = randomNormal(0, STAND_TURN_NOISE);
        // this.angle = turn;
    }

    this.angle = (this.angle + turn) % 1;

    // // move
    if(keys.up || keys.down){
        dist = (keys.down ? -1 : 1) * (MOVE_DIFF + randomNormal(0, MOVE_NOISE));
        // dist_y = -Math.cos(this.angle * 2 * Math.PI) * dist;
        // dist_x = Math.sin(this.angle * 2 * Math.PI) * dist;
        this.speed.x += Math.sin(this.angle * 2 * Math.PI) * (keys.down ? -1 : 1) * ENGINE_ACCELERATION * TICK_TIME;
        this.speed.y += -Math.cos(this.angle * 2 * Math.PI) * (keys.down ? -1 : 1) * ENGINE_ACCELERATION * TICK_TIME;
    }
    // else if(this.standby_actions && STANDBY_MOVE){
    //     dist_x = randomNormal(0, MOVE_NOISE);
    //     dist_y = randomNormal(0, MOVE_NOISE);
    // }

    // // gravity
    gravity = model.getGravityInfluence(this, ROBOT_MASS);
    // move_vector = vectorAdd({x: dist_x, y: dist_y}, gravity);

    // new_x = this.x + move_vector.x;
    // new_y = this.y + move_vector.y;

    // apply gravity
    this.speed.x += gravity.x * TICK_TIME; // v = v0 + a*dt
    this.speed.y += gravity.y * TICK_TIME;

    dist_x = this.speed.x * TICK_TIME;
    dist_y = this.speed.y * TICK_TIME;

    new_x = this.x + dist_x;
    new_y = this.y + dist_y;

    console.log("gravity: ", gravity, "; speed: ", this.speed, "dist: ", {x: dist_x, y: dist_y}, "; new position: ", {x: new_x, y: new_y});

    if(model.isPossiblePosition({x: new_x, y: new_y})){
        this.x = new_x;
        this.y = new_y;
    }
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
