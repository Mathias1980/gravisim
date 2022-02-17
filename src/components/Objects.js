import React from 'react';
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'

function Objects(props) {
    return (
        <div className="bodysets">
            <select onChange={props.setObjects} value={props.objects.selected} name="selected">
                <option value="-1">Bitte wählen</option>
                {
                    props.objects.list.map(el => <option value={el._id}>{el.name}</option>)
                }
            </select>
            <input required type="text" onChange={props.setObjects} placeholder="bez" value={props.objects.name} name="name" />
            <button disabled={!props.objects.name} onClick={props.addObjects}>Save {props.objects.list.length}</button>
            <button disabled={!props.objects.selected} onClick={props.loadObjects}>Load</button>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps) (Objects);