import React from 'react';
import PropTypes from 'prop-types';
import Configure from './Configure';
import Paper from '@material-ui/core/Paper';

const Configuration = ({ types, roads, updateType, updateRoad }) => {

    if (!types && !roads) { return <div />; }

    const onTypeChange = (e) => {
        updateType(e.target.value, e.target.checked);
    };
    
    const onRoadChange = (e) => {
        updateRoad(e.target.value, e.target.checked);
    };

    return (
        <Paper style={{padding: "20px", margin: "5px" }}>
            {types && <Configure title="Types" elements={types} onChange={onTypeChange} />}
            <br />
            {roads && <Configure title="Roads" elements={roads} onChange={onRoadChange}/>}
        </Paper>
    );
};

Configuration.propTypes = {
    types: PropTypes.object,
    roads: PropTypes.object,
    updateType: PropTypes.func,
    updateRoad: PropTypes.func
};

export default Configuration;