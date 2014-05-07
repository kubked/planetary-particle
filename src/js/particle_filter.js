var SELECTION_PARTICLES_COUNT = parseInt(0.99 * PARTICLES_COUNT, 10);
    RANDOM_PARTICLES = PARTICLES_COUNT - SELECTION_PARTICLES_COUNT;

document.addEventListener("clockTick", function(e){
    var robot_sensors = robot.sense(),
        weights = [],
        new_particles = [],
        new_indexes = [],
        index,
        cpi = current_particles_index,
        api = (current_particles_index + 1) % 2;

    robot.move.call(robot, e);
    for(var i=0; i<PARTICLES_COUNT; ++i){
        particles[i].move.call(particles[i], e);
    }

    for(var i=0;i<particles.length;i++){
        weights.push(particles[i].measurement(robot_sensors));
    }

     console.log(weights);

    // selection
    index = randomIntFromInterval(0, PARTICLES_COUNT - 1);
    beta = 0.0;
    mw = Math.max.apply(null, weights);
    for(var i=0;i<SELECTION_PARTICLES_COUNT;i++){
        beta += Math.random() * 2.0 * mw;
        while(beta > weights[index]){
            beta -= weights[index];
            index = (index + 1) % PARTICLES_COUNT;
        }
        new_indexes.push(index);
        //new_particles.push(new Particle(particles[index].x, particles[index].y, particles[index].angle));
       p = particles_table[api][i];
       p.x = particles[index].x;
       p.y = particles[index].y;
       p.angle = particles[index].angle;
    }
    // random
    for(var i=0;i<RANDOM_PARTICLES;i++){
        new_particles.push(
            new Particle(
            randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
            randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES),
            Math.random()
        ));
    }
    
    // particles = new_particles;
    current_particles_index = api;
    particles = particles_table[current_particles_index];
});
