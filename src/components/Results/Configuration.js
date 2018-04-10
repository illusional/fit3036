import React from 'react';
import PropTypes from 'prop-types';
import Configure from './Configure';
import { Typography } from 'material-ui/styles';

const Configuration = ({ types, roads, updateType, updateRoad }) => {

    const onTypeChange = (e) => {
        updateType(e.target.value, e.target.checked);
    };
    
    const onRoadChange = (e) => {
        updateRoad(e.target.value, e.target.checked);
    };

    return (
        <div>
            {types && <Configure title="Types" elements={types} onChange={onTypeChange} />}
            <br />
            {roads && <Configure title="Roads" elements={roads} onChange={onRoadChange}/>}
        </div>
    );
};

Configuration.propTypes = {
    types: PropTypes.object,
    roads: PropTypes.object,
    updateType: PropTypes.func,
    updateRoad: PropTypes.func
};

export default Configuration;