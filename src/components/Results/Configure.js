import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Typography from 'material-ui/Typography';
import NumberFormat from 'react-number-format';

const Configure = ({title, elements, onChange}) => {

  return (
    <div>
      <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>
        {Object.keys(elements).sort().map((val, idx) => (
          <FormControlLabel key={idx}
        label={<Typography>{val + " ("}<NumberFormat value={elements[val].area || 0} thousandSeparator displayType={'text'} decimalScale={0}/>m<sup>2</sup>)</Typography>}
            control={ 
            <Checkbox
              style={{height: "26px"}}
              checked={elements[val].on}
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