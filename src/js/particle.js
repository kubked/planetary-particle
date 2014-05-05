var PARTICLES_COUNT = 10;

function Particle(x, y, angle){
    Robot.call(this, x, y, angle);
}
Particle.prototype = Object.create(Robot.prototype);

var particles = [];

for(var i = 0; i < PARTICLES_COUNT; i++){
    particles.push(
        new Particle(
            randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
            randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
            randomIntFromInterval(0, 360)
        )
    );
}
