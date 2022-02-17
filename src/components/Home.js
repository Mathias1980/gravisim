import React from 'react';
import { connect } from 'react-redux'
import mapStateToProps from '../redux/mapStateToProps'
import mapDispatchToProps from '../redux/mapDispatchToProps'

function Home(props) {
    return (
        <div className="home">
            <h2 className='home'>Gravisim</h2>
            <p className='home'>v0.0.2</p>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps) (Home);