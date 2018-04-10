import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

const Configure = ({title, elements, onChange}) => {
  return (
    <div>
      <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>
        {Object.keys(elements).sort().map((val, idx) => (
          <FormControlLabel key={idx}
            label={val}
            control={ 
            <Checkbox
              style={{height: "26px"}}
              checked={elements[val]}
              onChange={onChange}
              value={val}
            />
          }/>
        ))}
      </FormGroup>
      </FormControl>
    </div>
  );
};

Configure.propTypes = {
  title: PropTypes.string.isRequired,
  elements: PropTypes.object.isRequired,  // has format: { key1: bool, key2: bool }
  onChange: PropTypes.func.isRequired
};

export default Configure;