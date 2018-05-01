import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import NumberFormat from 'react-number-format';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = {
    button: {
        display: "flex",
        margin: "15px auto 0 auto"
    }
};

const BoundsForm = ({bounds, classes, onFormSubmit, tfBoundsChanged}) => {
  return (
    <div>
      <p>Bounds of the map are:</p>
      <form onSubmit={onFormSubmit} noValidate autoComplete="off">
      {["left", "bottom", "right", "top"].map((val, idx) => {
        return (<NumberFormat fullWidth key={idx} decimalScale={5}
          label={val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()} 
          value={bounds[val]} 
          id={val}    
          customInput={TextField} 
          onChange={tfBoundsChanged} 
        />);
      })}
      <br />
      <Button variant="raised" size="medium" color="secondary" className={classes.button}>
        Reload Map and Data
      </Button>
      </form>
    </div>
  );
};

BoundsForm.propTypes = {
    classes: PropTypes.object,
    bounds: PropTypes.object,
    onFormSubmit: PropTypes.func,
    tfBoundsChanged: PropTypes.func
};

export default withStyles(styles)(BoundsForm);