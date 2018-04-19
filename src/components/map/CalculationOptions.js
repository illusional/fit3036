import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControl, MenuItem, Select, InputLabel } from 'material-ui';

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

const CalculationOptions = ({classes, roadOption, onRoadOptionChanged}) => {
      // Give the user options whether to
      //    - include road that extends outside the bounding box (up to the next node), 
      //    - determine the surface area of the road up to the bounding box, 
      //    - or exclude a road in which any part falls outside the bounding box.
    return (
        <div>
          
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="road-simple">Road inclusion:</InputLabel>
          <Select
            value={roadOption}
            onChange={onRoadOptionChanged}
            inputProps={{
              name: 'road',
              id: 'road-simple'
            }}
          >
            <MenuItem value={"include"}>Include the whole road </MenuItem>
            <MenuItem value={"truncate"}>Truncate the road at the border</MenuItem>
            <MenuItem value={"exclude"}>Exclude any road that falls outside</MenuItem>
          </Select>
        </FormControl>
        </div>
    );
};

CalculationOptions.propTypes = {
    classes: PropTypes.object,
    roadOption: PropTypes.string,
    onRoadOptionChanged: PropTypes.func
};

export default withStyles(styles)(CalculationOptions);