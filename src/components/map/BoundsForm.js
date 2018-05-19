import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadData, updateBounds } from '../../data/actions/dataActions';
import { updateMode } from '../../data/actions/configActions';

import CalculationOptions from './CalculationOptions';
import AddressLookup from './AddressLookup';

import { withStyles } from 'material-ui/styles';
import NumberFormat from 'react-number-format';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

const styles = {
  button: {
      display: "flex",
      margin: "15px auto 0 auto"
  }
};

class BoundsForm extends React.Component {

  constructor(props, content) {
    super(props, content);
    this.state = {
      textBounds: props.bounds
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.tfBoundsChanged = this.tfBoundsChanged.bind(this);
    this.onRoadOptionChanged = this.onRoadOptionChanged.bind(this);
    this.onAddressLookup = this.onAddressLookup.bind(this);
    this.viewInVisualiser = this.viewInVisualiser.bind(this);

    const { left, right, top, bottom } = props.bounds;
    props.actions.loadData(left, bottom, right, top, props.mode);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bounds === nextProps.bounds) return; 
    this.setState(Object.assign({}, this.state, { textBounds: nextProps.bounds }));
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { left, right, top, bottom } = this.state.textBounds;
    const option = this.state.roadOption;
    this.props.actions.loadData(left, bottom, right, top, option);
  }

  onRoadOptionChanged(e) {
    this.props.actions.updateMode(e.target.value);
  }

  tfBoundsChanged(e) {
    const value = Number(e.target.value) || this.state.bounds[e.target.id];
    let bounds = Object.assign({}, this.state.textBounds, {[e.target.id] : e.target.value});
    this.setState(Object.assign({}, this.state, { textBounds: bounds }));
  }

  
  onAddressLookup(coordinate) {
    const { left, right, top, bottom } = this.props.bounds;
    const maxRange = 0.005; // 1km by 1km
    const dwt = Math.abs(right - left);
    const dht = Math.abs(bottom - top);
    const dw = Math.min(dwt, maxRange);
    const dh = Math.min(dht, maxRange);
    const bounds = {
      top: coordinate.lat + dw,
      bottom: coordinate.lat - dw,
      left: coordinate.lng - dh,
      right: coordinate.lng + dh
    };
    this.props.actions.loadData(bounds.left, bounds.bottom, bounds.right, bounds.top, this.state.roadOption);
  }
  viewInVisualiser() {
    // http://overpass-turbo.eu/?Q=node(50.746%2C7.154%2C50.748%2C7.157)%3B%0Aout%20body%3B&C=50.74697;7.15548;17&R
    const { left, right, top, bottom } = this.props.bounds;
    window.open(`http://overpass-turbo.eu/?Q=way[highway](${bottom},${left},${top},${right});(._;>;);out body;`);
  }
  
  render() {
    return (
      <div>
        <AddressLookup onCoordinateChange={this.onAddressLookup}/>
        <p>Bounds of the map are:</p>
        <form onSubmit={this.onFormSubmit} noValidate autoComplete="off">
        {["left", "bottom", "right", "top"].map((val, idx) => {
          return (<NumberFormat fullWidth key={idx} decimalScale={5}
            label={val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()} 
            value={this.state.textBounds[val]} 
            id={val}    
            customInput={TextField} 
            onChange={this.tfBoundsChanged} 
          />);
        })}
        <br />
        <CalculationOptions roadOption={this.props.mode} onRoadOptionChanged={this.onRoadOptionChanged} />
        <Button type="submit" variant="raised" size="medium" color="secondary" className={this.props.classes.button}>
          Reload Map and Data
        </Button>
        <Button onClick={this.viewInVisualiser} style={{marginLeft: 'auto', marginRight: 0, display: 'block'}}>View in visualizer</Button>
        </form>
      </div>
    );
  }
}

BoundsForm.propTypes = {
  classes: PropTypes.object,
  actions: PropTypes.object.isRequired,
  bounds: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};


function mapStateToProps(state, ownProps) {
  return {
    bounds : state.data.bounds,
    mode: state.config.mode 
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators({ loadData, updateBounds, updateMode }, dispatch)
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BoundsForm));

