var PARTICLES_COUNT = 1000,
    UNDEFINED_DIST = 1000000000
    PLANET_DIFF_FACTOR = 0.1;

function Particle(x, y, angle){
    Robot.call(this, x, y, angle, true);
}
Particle.prototype = Object.create(Robot.prototype);

Particle.prototype.measurement = function(robot_sensors){
    var pr = 1.0, i = 0, dist, planet_position,
        planetsInRange = model.getPlanetsInRadarRange(this, this.angle, RADAR_RANGE, RADAR_ANGLE),
        particlesDists = []
    for(var j=0;j<planetsInRange.length;j++ ){
        planet = planetsInRange[j];
        planet_position = model.getPlanetPosition(planet);
        dist = Math.sqrt(Math.pow(this.x - planet_position.x, 2) + Math.pow(this.y - planet_position.y, 2))
        particlesDists.push(dist);
    }
    particlesDists = particlesDists.sort();
    for(var j=0;j<Math.min(particlesDists.length, robot_sensors.length);j++){
        pr *= gaussian(robot_sensors[j], SENSE_NOISE, particlesDists[j]);
    }
    pr *= Math.pow(PLANET_DIFF_FACTOR, Math.abs(particlesDists.length - robot_sensors.length));
    return pr;
}

var particles1 = [],
    particles2 = [],
    particles_table = [particles1, particles2],
    current_particles_index = 0,
    particles = particles_table[current_particles_index];

for(var k=0; k<=1;k++){
    for(var i = 0; i < PARTICLES_COUNT; i++){
        particles_table[k].push(
            new Particle(
                randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
                randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
                Math.random()
            )
        );
    }
}
