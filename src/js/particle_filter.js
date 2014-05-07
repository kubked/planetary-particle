var SELECTION_PARTICLES_COUNT = parseInt(0.98 * PARTICLES_COUNT, 10);
    RANDOM_PARTICLES = PARTICLES_COUNT - SELECTION_PARTICLES_COUNT
    SELECTION_AFTER_TICKS = 5;

var ticks = SELECTION_AFTER_TICKS - 1;

document.addEventListener("clockTick", function(e){
    var robot_sensors = robot.sense(),
        weights = [],
        new_indexes = [],
        index,
        cpi = current_particles_index,
        api = (current_particles_index + 1) % 2,
        p;

    robot.move.call(robot, e);
    for(var i=0; i<PARTICLES_COUNT; ++i){
        particles[i].move.call(particles[i], e);
    }

    ticks += 1;

    if(ticks == SELECTION_AFTER_TICKS){
        ticks = 0;
        for(var i=0;i<particles.length;i++){
            weights.push(particles[i].measurement(robot_sensors));
        }

        // console.log(weights);

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
            p = particles_table[api][i];
            p.x = particles[index].x;
            p.y = particles[index].y;
            p.angle = particles[index].angle;
        }
        // random
        for(var i=1;i<=RANDOM_PARTICLES;i++){
            p = particles_table[api][PARTICLES_COUNT-i];
            p.x = randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES);
            p.y = randomIntFromInterval(-MAP_BOUNDARIES, MAP_BOUNDARIES);
            p.angle = Math.random();
        }

        current_particles_index = api;
        particles = particles_table[current_particles_index];
    }
});
