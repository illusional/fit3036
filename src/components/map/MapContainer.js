import React from 'react';
import PropTypes from 'prop-types';
import { loadData } from '../../actions/dataActions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import CalculationOptions from './CalculationOptions';

import { Map, TileLayer, Rectangle } from 'react-leaflet';
import { MapBounds } from 'react-leaflet-bounds';
import NumberFormat from 'react-number-format';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import AddressLookup from './AddressLookup';
import { Paper } from 'material-ui';
import BoundsForm from './BoundsForm';

const styles = {
  paper: {
    padding: "10px",
    marginTop: "10px"
  }
};

class MapContainer extends React.Component {
  constructor(props, content) {
    super(props, content);

    this.state = {
      bounds: props.bounds,
      textBounds: props.bounds,
      roadOption: "truncate"

      // [[-37.8587, 145.1876], [-37.8495, 145.2049]]
    };

    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRoadOptionChanged = this.onRoadOptionChanged.bind(this);
    this.tfBoundsChanged = this.tfBoundsChanged.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onCoordinateChange = this.onCoordinateChange.bind(this);
  }

  onClick(event) {
    // refresh data here...
    const { left, bottom, right, top } = this.state.bounds;
    this.props.loadData(left, bottom, right, top, this.state.roadOption);
  }

  onViewportChanged(viewport) {
    if (!this.map) { return; }
    const mapBounds = this.map.leafletElement.getBounds();

    // {"_southWest":{"lat":85.05059422848228,"lng":-37.857097106461886},"_northEast":{"lat":85.05133468635948,"lng":-37.8476986460737}}"
    // I think they're mapped incorrectly in the module...
    const bounds = { 
      left: mapBounds._southWest.lng,
      bottom: mapBounds._southWest.lat,
      right: mapBounds._northEast.lng,
      top: mapBounds._northEast.lat
    };
    this.setState(Object.assign({}, this.state, { bounds, textBounds: bounds }));
  }

  onRoadOptionChanged(event) {
    this.setState(Object.assign({}, this.state, {roadOption: event.target.value}));
  }

  tfBoundsChanged(e) {
    const value = Number(e.target.value) || this.state.bounds[e.target.id];
    let bounds = Object.assign({}, this.state.bounds, {[e.target.id] : e.target.value});
    this.setState(Object.assign({}, this.state, { textBounds: bounds }));
  }

  onFormSubmit(f) {
    f.preventDefault();
    this.setState(Object.assign({}, this.state, {bounds: this.state.textBounds}));

    const { left, bottom, right, top } = this.state.textBounds;
    this.props.loadData(left, bottom, right, top, this.state.roadOption);

  }

  onCoordinateChange(coordinate) {
    const { left, right, top, bottom } = this.state.bounds;
    const maxRange = 0.005; // 1km by 1km
    const dwt = right - left;
    const dht = bottom - top;
    const dw = dwt > 0 ? Math.min(dwt, maxRange) : Math.max(dwt, -maxRange);
    const dh = dht > 0 ? Math.min(dht, maxRange) : Math.max(dht, -maxRange);
    const bounds = {
      top: coordinate.lat - dw,
      bottom: coordinate.lat + dw,
      left: coordinate.lng - dh,
      right: coordinate.lng + dh
    };
    this.setState(Object.assign({}, this.state, { bounds, textBounds: bounds}));
    this.props.loadData(bounds.left, bounds.bottom, bounds.right, bounds.top, this.state.roadOption);
  }

  

  render() {
    const { left, bottom, right, top } = this.state.bounds;
    const boundArray = [[bottom, left], [top, right]];
    
    return (
      <div>      
        <CalculationOptions roadOption={this.state.roadOption} onRoadOptionChanged={this.onRoadOptionChanged}/>
        <Button onClick={this.onClick}variant="raised" size="medium" color="primary">
          Reload Data
        </Button>
        <br />
        <div className="leaflet-container">
          <Map 
            bounds={boundArray} 
            onViewportChanged={this.onViewportChanged} 
            ref={(map) => { this.map = map; }} 
          >
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </Map>
        </div>
        <Paper className={this.props.classes.paper}>
          <Typography variant="subheading" align="center" gutterBottom>Bounds Settings</Typography>
          <AddressLookup onCoordinateChange={this.onCoordinateChange}/>
          {this.state.bounds && <BoundsForm 
            bounds={this.state.bounds}
            onFormSubmit={this.onFormSubmit}
            tfBoundsChanged={this.tfBoundsChanged}
          />}
        </Paper>
      </div>
    );
  }
}

MapContainer.propTypes = {
  bounds: PropTypes.object,
  loadData: PropTypes.func,
  classes: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    bounds: state.data.bounds
  };
}

function mapDispatchToProps(dispatch){
  return {
    loadData: bindActionCreators({ loadData }, dispatch).loadData
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MapContainer));