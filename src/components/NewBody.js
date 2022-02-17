import React, {useRef}from 'react';
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'
import * as Gravity from '../module/gravity';
import { gravilib } from '../module/gravilib';
import {Body} from '../module/body';

function NewBody(props) {

    const modus = useRef(0);

    const changeBody = () =>{
        modus.current = 1;
        newBody();
        modus.current = 0;
    }

    const newBody = () => {

        // Position

        let newPos = props.newPos();

        //Velocity

        let newVel = new Body().vel;
        if(props.body.vel.velid == -2 && props.body.vel.value){
            newVel = {
                x: Number(props.body.vel.value) * Math.cos(Number(props.body.vel.alpha) * (Math.PI/180)),
                y: Number(props.body.vel.value) * Math.sin(Number(props.body.vel.alpha) * (Math.PI/180))
            }
        }else if(props.body.vel.velid > -1 && props.body.vel.value){
            let relBody = props.bodies.find(x => x.id == props.body.vel.velid);
            let relAlpha = 0;
            if(newPos.y - relBody.pos.y == 0){
                relAlpha = Number(props.body.vel.alpha)
            }else{
                //console.log(Gravity.angle(relBody.pos, newPos));
                let theta = Number(props.body.vel.alpha) + Gravity.angle(relBody.pos, newPos);
                relAlpha = theta > 360 ? theta - 360 : theta;
            } 
            //console.log(relAlpha);
            let tmpVel = {
                x: Number(props.body.vel.value) * Math.cos(relAlpha * Math.PI / 180),
                y: Number(props.body.vel.value) * Math.sin(relAlpha * Math.PI / 180)
            }
            newVel = {
                x: relBody.vel.x + tmpVel.x,
                y: relBody.vel.y + tmpVel.y
            }
        }
        
        //Color

        let densObj = gravilib.material.find(el => el.dens == props.body.dens)

        //Body

        let color = new Body().color;
        if(props.body.namelist != '-1') color = props.body.color;
        if(densObj) color = gravilib.colorByDensObj(densObj);

        let neu = new Body({
            name: props.body.name ? props.body.name : new Body().name,
            pos: newPos,
            vel: newVel,
            dens: props.body.dens ? Number(props.body.dens) : new Body().dens,
            rad: props.body.rad ? Number(props.body.rad) : new Body().rad,
            id: modus.current ? props.body.id: Gravity.newID(props.bodies),
            color: color,
            hasTail: props.body.hasTail
        })

        // restitution
        neu.restitution = gravilib.restitutionByDens(neu.dens, props.setting.restitution)

        //Bahngeschwindigkeit ?

        if(props.body.vel.isKg && props.body.vel.velid > -1) {
            let relBody = props.bodies.find(x => x.id == props.body.vel.velid);
            let relAlpha = 90;
            if(newPos.y - relBody.pos.y != 0){
                let theta = Number(props.body.vel.alpha) + Gravity.angle(relBody.pos, newPos);
                relAlpha = theta > 360 ? theta - 360 : theta;
            }
            let tmpVel = {
                x: Math.sqrt(((1 + Number(props.body.vel.kg)/100) * props.setting.G * (neu.mass + relBody.mass)) / Gravity.getDistanceMS(relBody, neu, props.ratio.meter)) * Math.cos(relAlpha * Math.PI / 180),
                y: Math.sqrt(((1 + Number(props.body.vel.kg)/100) * props.setting.G * (neu.mass + relBody.mass)) / Gravity.getDistanceMS(relBody, neu, props.ratio.meter)) * Math.sin(relAlpha * Math.PI / 180)
            }
            newVel = {
                x: relBody.vel.x + tmpVel.x,
                y: relBody.vel.y + tmpVel.y
            }
            neu.vel = newVel;
        }

        if(!Gravity.collisionAll(neu, props.bodies, props.ratio.meter) || modus.current){ 
            props.addBody(neu)
            !modus.current && props.clearBody();
            modus.current && props.countDOWN();
            props.countUP();
        }
    }

    return (
        <div className="newBody">
            <h2>Body</h2>
            <label>Name: 
                <input required type="text" onChange={props.setNewBody} value={props.body.name} name="name" />
                <select required onChange={props.setName} value={props.body.namelist} name="namelist">
                    <option value="-1">Bitte wählen</option>
                    {
                        gravilib.bodies.map(el => <option value={el.id}>{el.name}</option>)
                    }
                </select>
            </label>
            <label>Radius: 
                <input required type="text" onChange={props.setNewBody} value={props.body.rad}  placeholder='m' name="rad" />
            </label>
            <label>Material: 
                <input required type="text" onChange={props.setNewBody} value={props.body.dens} placeholder="Dichte kg/m³" name="dens" />
                <select required onChange={props.setNewBody} value={props.body.denslist} name="denslist">
                    <option value="-1">Bitte wählen</option>
                    {
                        gravilib.material.map(el => <option value={el.dens}>{el.name}</option>)
                    }
                </select>
            </label>
            <label>Position:
                <select required onChange={props.setNewBodyPos} value={props.body.pos.posid} name="posid">
                    <option value="-1">Bitte wählen</option>
                    <option value="-2">Center</option>
                    {
                        props.bodies.map(el => <option value={el.id}>{el.name}</option>)
                    }
                    
                </select>
                <input required type="text" onChange={props.setNewBodyPos} placeholder="alpha (°)" value={props.body.pos.alpha} name="alpha" />
                <input required type="text" onChange={props.setNewBodyPos} placeholder="m" value={props.body.pos.dist} name="dist" /> 
            </label>
            <label>Velocity:
                <select required onChange={props.setNewBodyVel} value={props.body.vel.velid} name="velid">
                    <option value="-1">Bitte wählen</option>
                    <option value="-2">Center</option>
                    {
                        props.bodies.map(el => <option value={el.id}>{el.name}</option>)
                    }
                </select>
                <input required type="text" disabled={props.body.vel.isKg} onChange={props.setNewBodyVel} placeholder="alpha (°)" value={props.body.vel.alpha} name="alpha" />
                <input required type="text" disabled={props.body.vel.isKg} onChange={props.setNewBodyVel} placeholder="m/s" value={props.body.vel.value} name="value" /> 
            </label>      
            <label>Bahngeschwindigkeit:
                <input type="checkbox" disabled={props.body.vel.velid==-1} onChange={props.setNewBodyVelKg} checked={props.body.vel.isKg} name="isKg"/>
            </label> 
            <input type="range" disabled={!props.body.vel.isKg} value={props.body.vel.kg} onChange={props.setNewBodyVel} name="kg" min="0" max="100" step="1"/> 
            <label>Schweif:
                <input type="checkbox" onChange={props.setNewBodyHasTail} checked={props.body.hasTail} name="hasTail"/>
            </label>   
            <button onClick={newBody}>New {props.count}</button>
            <button disabled={props.body.id==0} onClick={changeBody}>Change</button>
            <button disabled={props.body.id==0} onClick={props.delBody}>Delete</button>
            <button onClick={props.clearBody}>{String.fromCodePoint('0x27F3')}</button>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps) (NewBody);