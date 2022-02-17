import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'
import * as Gravity from '../module/gravity';

function Canvas(props) {

    const canvasRef = useRef(null);
    const {draw, active, count} = props;
    const location = useLocation();

    useEffect(() => {
      //console.log(location);
    }, [location]);
    
    useEffect(() => {
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      let secondsPassed = 0;
      let oldTimeStamp = Date.now();
      let animationFrameId;

      const render = (timestamp = Date.now()) => {
        if(props.setting.realtime){
          secondsPassed = (timestamp - oldTimeStamp) / 1000;      
          secondsPassed = Math.max(secondsPassed, 0);
        }else{
          secondsPassed = Number(props.setting.timespeed); 
        }
        oldTimeStamp = timestamp;

        resizeCanvasToDisplaySize(canvas);
        context.clearRect(-context.canvas.width/2, -context.canvas.height/2, context.canvas.width/2, context.canvas.height/2);
        context.translate(context.canvas.width/2, context.canvas.height/2);
        draw(context, secondsPassed);
        if(active){            
            animationFrameId = window.requestAnimationFrame(render)
        }else{
            window.cancelAnimationFrame(animationFrameId)
        }       
      }

      render();
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }, [draw, active, count])

    const resizeCanvasToDisplaySize = (canvas) => {
        canvas.width = window.innerWidth - 280;
        canvas.height = window.innerHeight -90;
    }

    const handleClick = (evt) => {
      let tmp = canvasRef.current.getContext('2d');
      let rect = canvasRef.current.getBoundingClientRect();
      let pos = getMousePos(evt, tmp, rect);

      if(location.pathname == '/Body'){
        let body = props.getBodyByPos(pos);
        if(body){
          props.setBody(body)
        }else{
          props.setPos({posid: '-2', alpha: Gravity.angle({x:0, y:0}, pos), dist: Gravity.getDistance({x:0, y:0}, pos, props.ratio.meter)});
        }
      }
    }

    const handleContextMenu = (evt) => {
      evt.preventDefault();
      let tmp = canvasRef.current.getContext('2d');
      let rect = canvasRef.current.getBoundingClientRect();
      let mousePos = getMousePos(evt, tmp, rect);

      if(location.pathname == '/Body' && props.body.pos.posid != '-1' && props.body.pos.alpha && props.body.pos.dist){
        let bodyPos = props.newPos();
        let vel = {
          velid: props.body.pos.posid,
          alpha: Gravity.angle(bodyPos, mousePos),
          value: Gravity.getDistance(bodyPos, mousePos, props.ratio.meter)
        }
        props.setNewBodyVelOnContextmenue(vel);
      }
    }

    const getMousePos = (evt, tmp, rect) => {
      return {
        x: evt.clientX - rect.left - tmp.canvas.width/2,
        y: evt.clientY - rect.top - tmp.canvas.height/2
      };
    }
    
    return <canvas ref={canvasRef} onClick={handleClick} onContextMenu={handleContextMenu}/>
}

export default connect(mapStateToProps, mapDispatchToProps) (Canvas);