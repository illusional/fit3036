import React from 'react';
import PropTypes from 'prop-types';

const styles = {};

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Input, Paper, MenuItem, withStyles } from '@material-ui/core';

class AddressLookup extends React.Component {
  constructor(props) {
    super(props);  
    this.state = { address: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange (address) {
    this.setState({ address });
  }

  handleSelect (address) {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => { this.props.onCoordinateChange(latLng); });
  }

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <Input
              fullWidth
              {...getInputProps({
                placeholder: 'Search for a place ...',
                className: 'location-search-input'
              })}
            />
            {suggestions && suggestions.length > 0 &&
                <Paper className="autocomplete-dropdown-container">
                {suggestions.map((suggestion, idx) => {
                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                    return (
                    <MenuItem {...getSuggestionItemProps(suggestion, { className, style })} key={idx}>
                        <span>{suggestion.description}</span>
                    </MenuItem>
                    );
                })}
            </Paper>}
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

AddressLookup.propTypes = {
    onCoordinateChange: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    return {
        state : state
    };
}


export default withStyles(styles)(AddressLookup);