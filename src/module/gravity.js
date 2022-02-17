import {Body} from './body';

const newID = (data) => {
    return Math.max( ...data.map(el => el.id), 0 ) + 1
}

const getVelByAngle = (newPos, relPos, value) => {       
    return  {
        x: Math.sin(Math.atan2(relPos.x - newPos.x, relPos.y - newPos.y)) * value, 
        y: Math.cos(Math.atan2(relPos.x - newPos.x, relPos.y - newPos.y)) * value
    }
};

const getPosByAngle = (newPos, relPos) => {       
    return {
        x: newPos.dist*Math.cos(newPos.alpha) + relPos.x, 
        y: newPos.dist*Math.sin(newPos.alpha) + relPos.y
    }
};

const angleByPos = (pos) => {
    let theta = Math.atan2(pos.y, pos.x) * 180 / Math.PI; 
    if (theta < 0) theta += 360; 
    return theta;
}

const angle = (pos1, pos2) => {
    var dy = pos2.y - pos1.y;
    var dx = pos2.x - pos1.x;
    var theta = Math.atan2(dy, dx); 
    theta *= 180 / Math.PI; 
    if (theta < 0) theta = 360 + theta; 
    return theta;
  }

const getCenterPos = () => {
    return {
        x: 0,
        y: 0
    }
}

const getRandomPos = (bodies) => {
    for(let i = 0; i < 10000; i++){
        let tmp = new Body();
        if(bodies.length > 0){
            if(bodies.find(el => Math.sqrt(Math.pow(Math.abs(tmp.pos.x - el.pos.x), 2) + Math.pow(Math.abs(tmp.pos.y - el.pos.y), 2)) <= tmp.rad + el.rad) === undefined ){
                return tmp.pos;
            } 
        }else{
            return tmp.pos;
        }
    }
}

const getDistance = (pos1, pos2, meter) => {  
    return Math.sqrt(Math.pow(Math.abs((pos1.x - pos2.x)*meter/100), 2) + Math.pow(Math.abs((pos1.y - pos2.y)*meter/100), 2));
};

const getDistanceMS = (obj1, obj2, meter) => { 
    let dist = getDistance(obj1.pos, obj2.pos, meter);  
    return obj2.mass / (obj1.mass + obj2.mass) * dist;
};

const getSquareDistance = (pos1, pos2, meter) => {   
    return Math.pow(Math.abs((pos1.x - pos2.x)*meter/100), 2) + Math.pow(Math.abs((pos1.y - pos2.y)*meter/100), 2);
};

const getAttraction = (G, posAttr, posObj, mass, distance) => {
    let attraction = G * mass / Math.pow(distance, 2);
        return {
            x: Math.sin(Math.atan2(posAttr.x - posObj.x, posAttr.y - posObj.y)) * attraction, 
            y: Math.cos(Math.atan2(posAttr.x - posObj.x, posAttr.y - posObj.y)) * attraction
        };
};

const collision = (a, b, meter) => {
    if (getSquareDistance(a.pos, b.pos, meter) <= (a.rad + b.rad) * (a.rad + b.rad)) return true 
    return false;
}

const collisionAll = (a, bodies, meter) => {
    for(let body of bodies){
        if(collision(a, body, meter)) return true
    }
    return false;
}

const collisionReaction = (obj1, obj2) => {
    let vCollision = {x: obj2.pos.x - obj1.pos.x, y: obj2.pos.y - obj1.pos.y};
    let distance = Math.sqrt((obj2.pos.x-obj1.pos.x)*(obj2.pos.x-obj1.pos.x) + (obj2.pos.y-obj1.pos.y)*(obj2.pos.y-obj1.pos.y));
    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
    let vRelativeVelocity = {x: obj1.vel.x - obj2.vel.x, y: obj1.vel.y - obj2.vel.y};
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    if (speed >= 0){
        speed *= Math.min(obj1.restitution, obj2.restitution);
        let impulse = 2 * speed / (obj1.mass + obj2.mass);
        obj1.vel.x -= (impulse * obj2.mass * vCollisionNorm.x);
        obj1.vel.y -= (impulse * obj2.mass * vCollisionNorm.y);
        obj2.vel.x += (impulse * obj1.mass * vCollisionNorm.x);
        obj2.vel.y += (impulse * obj1.mass * vCollisionNorm.y);
    }
}

const addAttraction = (obj, attractor, G, meter) => {
    let attr = getAttraction(G, attractor.pos, obj.pos, attractor.mass, getDistance(attractor.pos, obj.pos, meter));
    obj.vel.x += attr.x;
    obj.vel.y += attr.y;
}

export {newID, getVelByAngle, getPosByAngle, angleByPos, angle, getCenterPos, getRandomPos, getDistance, getDistanceMS, getSquareDistance, getAttraction, collision, collisionAll, collisionReaction, addAttraction};


