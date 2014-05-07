var PARTICLES_COUNT = 0;

function Particle(x, y, angle){
    Robot.call(this, x, y, angle, true);
}
Particle.prototype = Object.create(Robot.prototype);

Particle.prototype.measurement = function(robot_sensors){
    var pr = 1.0, i = 0, dist, planet_position;
    for(var name in planets){
        if (planets.hasOwnProperty(name))
        {
            planet_position = model.getPlanetPosition(planets[name]);
            dist = Math.sqrt(Math.pow(this.x - planet_position.x, 2) + Math.pow(this.y - planet_position.y, 2))
            pr *= gaussian(robot_sensors[i], SENSE_NOISE, dist);
            i += 1;
        }
    }
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
