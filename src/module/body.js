import {mllib} from './mllib'

class Body {

    constructor({
        name = mllib.randomString(5),
        pos = {x:mllib.createNumber(-(window.innerWidth - 280)/2, (window.innerWidth - 280)/2), y: mllib.createNumber(-(window.innerHeight - 40)/2, (window.innerHeight - 40)/2)},
        vel = {x:mllib.createNumber(0,0), y:mllib.createNumber(0,0)},
        rad = mllib.createFloat(0.1, 1),
        //dens = mllib.createNumber(72,21000),
        dens = 10000,
        color = mllib.createColor(mllib.createNumber(10,90),mllib.createNumber(10,90)),
        id = 0, restitution = 1, tail = [], hasTail = false
    } = {}) {
        Object.assign(this, {name, pos, vel, rad, dens, color, id, restitution, tail, hasTail});
    }
    get mass(){
        return 4/3 * Math.pow(this.rad, 3) * Math.PI * this.dens;
    }
    getRadPx(meter){
        return this.rad*100/meter;
    }
    draw(ctx, meter, label, tail){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad*100/meter, 0, 2 * Math.PI );
        ctx.fill();
        ctx.stroke();
        if(this.hasTail || tail){
            for(let i = 1; i < this.tail.length; i++){
                if(this.tail.length > 0){
                    ctx.beginPath();
                    ctx.strokeStyle  = 'black';
                    ctx.moveTo(this.tail[i-1].x, this.tail[i-1].y);
                    ctx.lineTo(this.tail[i].x, this.tail[i].y);
                    ctx.stroke();
                }
            }
        }
        if(label){
            ctx.fillStyle = 'black';
            ctx.font = '17px serif';
            ctx.fillText(this.name, this.pos.x, this.pos.y);
        }
    }
    update(secondsPassed, meter, tail){
        //if(this.name=='Erde') console.log(meter, secondsPassed, this.pos, this.vel);
        this.pos.x += this.vel.x / meter * 100 * secondsPassed;
        this.pos.y += this.vel.y / meter * 100 * secondsPassed;
        if(this.hasTail || tail){
            this.tail = [{x:this.pos.x, y:this.pos.y}].concat(this.tail).slice(0, 200 * meter)
        }       
    }
}

export {Body};