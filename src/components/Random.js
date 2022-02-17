import React from 'react';
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'

function Random(props) {
    return (
        <div className="newBody">
            <h2>Random</h2>
            <input required type="text" onChange={props.setRandom} value={props.random.anz} name="anz" />
            <button onClick={props.rand}>Rand</button>
            <button onClick={props.fi1}>Test</button>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps) (Random);