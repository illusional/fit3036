import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControl, MenuItem, Select, InputLabel } from 'material-ui';
import Mode from '../../processing/mode';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

const CalculationOptions = ({classes, mode, onRoadOptionChanged}) => {
      // Give the user options whether to
      //    - include road that extends outside the bounding box (up to the next node), 
      //    - determine the surface area of the road up to the bounding box, 
      //    - or exclude a road in which any part falls outside the bounding box.
    return (
        <div>
          
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="road-simple">Road inclusion:</InputLabel>
          <Select
            value={mode}
            onChange={onRoadOptionChanged}
            inputProps={{
              name: 'road',
              id: 'road-simple'
            }}
          >
            <MenuItem value={Mode.include}>Include the whole road </MenuItem>
            <MenuItem value={Mode.intersection}>Intersect the road at the border</MenuItem>
            <MenuItem value={Mode.truncate}>Truncate the road to the nearest intersection</MenuItem>
          </Select>
        </FormControl>
        </div>
    );
};

CalculationOptions.propTypes = {
    classes: PropTypes.object,
    mode: PropTypes.string,
    onRoadOptionChanged: PropTypes.func
};

export default withStyles(styles)(CalculationOptions);