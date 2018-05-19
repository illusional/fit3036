/* eslint  react/no-multi-comp: 0*/
import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import NumberFormat from 'react-number-format';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

const getResult = (roads, config) => {
    if (!roads || roads.length === 0) { return "loading ..."; }

    let total = 0.0;
    let unit = undefined;

    for (let i=0; i < roads.length; i++) {
        let road = roads[i];
        if ((road.t in config.types && config.types[road.t].on) 
              && (road.n in config.roads && config.roads[road.n].on)) {
            total += road.a;
        }

        if (!unit) {
            unit = road.unit;
        }
    }
    return total;
};

const renderText = (n) => (
  <Typography variant="headline" align="center" gutterBottom>
    {n + "m"}<sup>2</sup>
  </Typography>
);

// calculate results

const Results = ({roads, config, error, retry}) => {

  if (error) {
    return (
      <div>
        <Typography>An error occurred:</Typography>
        <Typography>{error}</Typography>
        <Button color="primary" variant="raised" onClick={retry} styles={{display: "flex",
        margin: "15px auto 0 auto"}}>Retry</Button>
      </div>
    );
  }

  let bodytext = (!roads || roads.length === 0) 
    ? <Typography variant="headline" align="center" gutterBottom>Loading...</Typography>
    : <NumberFormat value={getResult(roads, config)} displayType={'text'} 
      thousandSeparator decimalScale={1} renderText={renderText}/>;


  return (
    <Paper style={{ textAlign: "center", padding: "10px", margin: "5px" }}>
      <Typography variant="subheading" align="center" gutterBottom>
        Road surface is estimated at (m<sup>2</sup>):
      </Typography>
      {bodytext}
    </Paper>
  );
};

Results.propTypes = {
    roads: PropTypes.array,
    config: PropTypes.object,
    error: PropTypes.string,
    retry: PropTypes.func
};

export default Results;