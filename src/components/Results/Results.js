import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

function getResultText(roads, config) {
    if (!roads || roads.length === 0) { return "loading ..."; }

    let total = 0.0;
    let unit = undefined;

    for (let i=0; i < roads.length; i++) {
        let road = roads[i];
        if (config.types[road.type] && config.roads[road.name]) {
            total += road.area;
        }

        if (!unit) {
            unit = road.unit;
        }
    }

    return `${total} ${unit}`;
}

// calculate results

const Results = ({roads, config, error, retry}) => {

  if (error) {
    return (
      <div>
        <Typography>An error occurred:</Typography>
        <Typography>{error}</Typography>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="subheading" align="center" gutterBottom>
        Road surface is estimated at:
        </Typography>
      <Typography variant="headline" align="center" gutterBottom>
        {getResultText(roads, config)}
      </Typography>
    </div>
  );
};

Results.propTypes = {
    roads: PropTypes.array,
    config: PropTypes.object,
    error: PropTypes.string,
    retry: PropTypes.func
};

export default Results;