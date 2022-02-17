import React from 'react';
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'

function Settings(props) {
    return (
        <div className="settings">
            <label>Gravitationskonstante G:<br/>
                <input type="range" name="G" min="6.67430e-11" max="0.0001" step="0.000001" value={props.setting.G} onChange={props.setSetting}/>
            </label>
            <label>Echtzeit:
                <input type="checkbox" onChange={props.setSetting} checked={props.setting.realtime} name="realtime"/>
            </label>
            <label>Timespeed:<br/>
                <input type="range" name="timespeed" min="1" max="10000" step="1" value={props.setting.timespeed} onChange={props.setSetting}/>
            </label>
            <label>Restitution:<br/>
                <input type="range" name="restitution" min="1" max="20" step="1" value={props.setting.restitution} onChange={props.setSetting}/>
            </label>
            <label>Label:
                <input type="checkbox" onChange={props.setSetting} checked={props.setting.label} name="label"/>
            </label>
            <label>Schweif:
                <input type="checkbox" onChange={props.setSetting} checked={props.setting.tail} name="tail"/>
            </label>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps) (Settings);