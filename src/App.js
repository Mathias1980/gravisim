import React, {useRef, useEffect} from 'react';
import { BrowserRouter, Route, NavLink, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import mapStateToProps from './redux/mapStateToProps'
import mapDispatchToProps from './redux/mapDispatchToProps'
import Canvas from './components/Canvas';
import NewBody from './components/NewBody';
import Random from './components/Random';
import Home from './components/Home';
import Objects from './components/Objects';
import Settings from './components/Settings';
import * as Gravity from './module/gravity';
import './App.css';
import { Body } from './module/body';
import { gravilib } from './module/gravilib';
import {mllib} from './module/mllib'
import * as Tone from 'tone'

function App(props) {

  const _bodies = useRef([])
  const timestamp = useRef(Date.now());
  const synth = useRef(new Tone.Synth().toDestination());
  const visitor = useRef({});
  
  useEffect(() => {
    props.getObjects();
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then((resJson=>{
        visitor.current['timestamp'] = new Date().toLocaleString();
        visitor.current['connection'] = {};
        visitor.current['connection']['downlink'] = navigator.connection.downlink;
        visitor.current['connection']['effectiveType'] = navigator.connection.effectiveType;
        visitor.current['connection']['rtt'] = navigator.connection.rtt;
        visitor.current['language'] = navigator.language;
        visitor.current['platform'] = navigator.platform;
        visitor.current['appVersion'] = navigator.appVersion;
        visitor.current['mobile'] = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
        visitor.current['screen'] = {};
        visitor.current['screen']['width'] = window.screen.width;
        visitor.current['screen']['height'] = window.screen.height;
        visitor.current['window'] = {};
        visitor.current['window']['width'] = window.innerWidth;
        visitor.current['window']['height'] = window.innerHeight;
        visitor.current['city'] = resJson.city;
        visitor.current['ip'] = resJson.ip;
        visitor.current['org'] = resJson.org;
        props.mailVisitor(visitor.current)
      }))
  }, []) 

  const draw = (ctx, secondsPassed) => {  
    //console.log(_bodies.current);
    const bodies = _bodies.current;

    // update
    for (let i = 0; i < bodies.length; i++) {  
      bodies[i].update(secondsPassed, props.ratio.meter, props.setting.tail);
    }

    // attraction
    for (let i = 0; i < bodies.length; i++) { 
      for(let j = 0; j < bodies.length; j++){
        if(bodies[i].id != bodies[j].id){
          Gravity.addAttraction(bodies[i], bodies[j], props.setting.G, props.ratio.meter);
        }
      }
    }

    // collision
    for (let i = 0; i < bodies.length; i++) { 
      for(let j = i + 1; j < bodies.length; j++){
        if(bodies[i].id != bodies[j].id){
          if(Gravity.collision(bodies[i], bodies[j], props.ratio.meter)){
            let impulse = Gravity.collisionReaction(bodies[i],bodies[j]);
            if(props.setting.sound){
              synth.current.volume.value = -20 + Math.min(impulse || 0, 40);
              synth.current.triggerAttackRelease("C4", "32n");
            }
          }
        }
      }
    }

    coordinates(ctx);

    // draw
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].draw(ctx, props.ratio.meter, props.setting.label, props.setting.tail);
    }

    time(ctx, secondsPassed);
    maßstab(ctx);
  }

  const coordinates = ctx => {
    ctx.beginPath();
    ctx.strokeStyle  = '#d6d6d6';
    for(let i = -ctx.canvas.width/2; i <= ctx.canvas.width/2; i+=100){
      ctx.moveTo(i, -ctx.canvas.height/2);
      ctx.lineTo(i, ctx.canvas.height/2);
      ctx.stroke();
    }
    for(let i = -ctx.canvas.height/2; i <= ctx.canvas.height/2; i+=100){
      ctx.moveTo(-ctx.canvas.width/2, i);
      ctx.lineTo(ctx.canvas.width/2, i);
      ctx.stroke();
    }
  }

  const maßstab = ctx => {
    ctx.font = 'bold 12px serif';
    ctx.fillText(props.ratio.anz + ' ' + props.ratio.text, ctx.canvas.width/2 - 185, ctx.canvas.height/2 - 52);
  }

  const time = (ctx, secondsPassed) => {
    ctx.fillStyle = 'black';
    timestamp.current = timestamp.current + (1000 * secondsPassed);
    ctx.font = 'bold 17px serif';
    ctx.fillText(new Date(timestamp.current).toLocaleString(), ctx.canvas.width/2 - 170, -ctx.canvas.height/2 + 30);
  }

  const addBody = (body) => {
    _bodies.current = _bodies.current.filter(el => el.id != body.id);
    _bodies.current.push(body);
  }

  const delBody = () => {
    _bodies.current = _bodies.current.filter(el => el.id != props.body.id);
    props.clearBody();
    props.countDOWN();
  }

  const clear = () =>{
    _bodies.current = [];
    timestamp.current = Date.now();
    props.countClear();
    props.clearBody();
  }

  const addObjects = () => {
    props.saveObjects({
      name: props.objects.name,
      objects: _bodies.current
    })
  }

  const scalePosition = (scale) => {
     _bodies.current.forEach((el, i) =>{
      _bodies.current[i].pos.x = _bodies.current[i].pos.x * scale;
      _bodies.current[i].pos.y = _bodies.current[i].pos.y * scale;
     })
  }

  const getBodyByPos = (pos) => {
      return _bodies.current.find(el => Gravity.getDistance(el.pos, pos, props.ratio.meter) <= el.rad)
  }

  const rand = () => {

    let count = 0, i = 0;
    while(count < props.random.anz && i < 10000){                    
        let tmp = new Body({
            rad: mllib.createFloat(0.05, 0.7),
            id: Gravity.newID(_bodies.current)
        });
        if(!Gravity.collisionAll(tmp, _bodies.current, props.ratio.meter)){ 
            addBody(tmp);
            count++;
        }
        i++;
        props.setCount(_bodies.current.length);
    }       
}

const fi1 = () => {

  let fib = mllib.fib(20);
  let rad = 0.0005;

  fib.forEach((el, i, arr) => {  
    if(i>1){
      let tmp = new Body({
        rad: rad * el,
        dens: 10 * el * 0.05,
        pos: {x: -500 + (rad * el + rad * arr[i-1] * 4) * props.ratio.meter * 100, y: -300 + (rad * el + rad * arr[i-1] * 4) * props.ratio.meter * 70},
        id: Gravity.newID(_bodies.current)
    });
    addBody(tmp);
    props.setCount(_bodies.current.length);
    }             
  })       
}

const newPos = () => {
  let newPos = Gravity.getRandomPos(_bodies.current);
  if(props.body.pos.posid == -2){
      let relPos = Gravity.getCenterPos()
      newPos = {
          x: relPos.x + (Number(props.body.pos.dist)*100/props.ratio.meter) * Math.cos(Number(props.body.pos.alpha) * (Math.PI/180)), 
          y: relPos.y + (Number(props.body.pos.dist)*100/props.ratio.meter) * Math.sin(Number(props.body.pos.alpha) * (Math.PI/180))
      }
  } else if(props.body.pos.posid > -1){
      let relPos = _bodies.current.find(x => x.id == props.body.pos.posid).pos
      newPos = {
          x: relPos.x + (Number(props.body.pos.dist)*100/props.ratio.meter) * Math.cos(Number(props.body.pos.alpha) * (Math.PI/180)), 
          y: relPos.y + (Number(props.body.pos.dist)*100/props.ratio.meter) * Math.sin(Number(props.body.pos.alpha) * (Math.PI/180))
      }
  }
  return newPos;
}

const loadObjects = () =>{
  _bodies.current = [];
  props.objects.list.find(el => el._id == props.objects.selected).objects.forEach(el => _bodies.current.push(new Body(el)));
  props.setCount(_bodies.current.length);
}

  return (
    <BrowserRouter>
      <div id="container">
        <header>
          <nav>
            <ul>
            <NavLink to="/Body" exact><li><p>Body</p></li></NavLink>
            <NavLink to="/Random" exact><li><p>Random</p></li></NavLink>
            <NavLink to="/Objects" exact><li><p>Objects</p></li></NavLink>
            <NavLink to="/Settings" exact><li><p>Settings</p></li></NavLink>
            </ul>
          </nav>
          <div className="animate">
            <button onClick={() => {
              if(props.ratio.id < gravilib.zoom.length) {
                props.stop()
                const newRatio = gravilib.zoom.find(el => el.id == props.ratio.id + 1);
                scalePosition(props.ratio.meter/newRatio.meter);
                props.setRatio(newRatio)}}}>-</button>
            <button onClick={() => {
              if(props.ratio.id > 1) {
                props.stop()
                const newRatio = gravilib.zoom.find(el => el.id == props.ratio.id - 1);
                scalePosition(props.ratio.meter/newRatio.meter);
                props.setRatio(newRatio)}}}>+</button>
            <button onClick={() => {
              const synth = new Tone.Synth().toDestination();
              const now = Tone.now()
              gravilib.notes.C.forEach((el, i) => synth.triggerAttackRelease(el, "8n", now + i))
              
                }}>Tone</button>
          </div>
          <div className="animate">
            <button onClick={() => {
              Tone.start();
              props.start();
            }}>{String.fromCodePoint('0x23F5')}</button>
            <button onClick={props.stop}>{String.fromCodePoint('0x23F8')}</button>
            <button onClick={clear}>{String.fromCodePoint('0x27F3')}</button>
          </div>
        </header>
        <main>
          <Canvas draw={draw} getBodyByPos={getBodyByPos} newPos={newPos}/>       
          <aside>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/Body" exact render={() => {return <NewBody addBody={addBody} delBody={delBody} bodies={_bodies.current} newPos={newPos}/>}} />
              <Route path="/Random" exact render={() => {return <Random rand={rand} fi1={fi1} bodies={_bodies.current}/>}} />
              <Route path="/Objects" exact render={() => {return <Objects addObjects={addObjects} loadObjects={loadObjects} />}} />
              <Route path="/Settings" exact component={Settings} />
            </Switch>
          </aside>
        </main>
    </div>
  </BrowserRouter>
  );
}

export default connect(mapStateToProps, mapDispatchToProps) (App);
