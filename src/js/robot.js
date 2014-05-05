MAP_BOUNDARIES = 3500000000;

function Robot(x, y, angle){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.distance_sensors = [];
    // another sensors here
    var me = this;
    document.addEventListener("clockTick", function(){
        me.move();
    })
}

Robot.prototype.destroy = function(){
    debugger;
    document.removeEventListener("clockTick", this.destroy);
}

Robot.prototype.move = function(){
    // move
    console.log("move");
}

Robot.prototype.sense = function(distance_sensors){

}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


var robot = new Robot(
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
    randomIntFromInterval(0, 360)
);

document.addEventListener("clockTick", function(){
    robot.move();
});
