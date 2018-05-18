import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from 'material-ui/styles';
import { loadData, updateBounds } from '../../actions/dataActions';

import NumberFormat from 'react-number-format';

import BoundsForm from './BoundsForm';
import AddressLookup from './AddressLookup';

import Typography from 'material-ui/Typography';
import { Paper } from 'material-ui';
import TextField from 'material-ui/TextField';

import { LatLng, LatLngBounds } from "leaflet";
import { Map, TileLayer, Rectangle } from 'react-leaflet';

import Button from 'material-ui/Button';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

const styles = {
  paper: {
    padding: "10px",
    marginTop: "10px"
  }
};

class MapContainer extends React.Component {
  constructor(props, content) {
    super(props, content);

    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onAddressLookup = this.onAddressLookup.bind(this);
    this.bindMapReference = this.bindMapReference.bind(this);
  }

  onViewportChanged(viewport) {
    if (!this.map) { return; }
    const mapBounds = this.map.leafletElement.getBounds();
    const left = mapBounds.getWest();
    const right = mapBounds.getEast();
    const bottom = mapBounds.getSouth();
    const top = mapBounds.getNorth();
    this.props.actions.updateBounds(left, bottom, right, top);
  }

  onAddressLookup(coordinate) {
    const { left, right, top, bottom } = this.state.bounds;
    const maxRange = 0.005; // 1km by 1km
    const dwt = right - left;
    const dht = bottom - top;
    const dw = dwt > 0 ? Math.min(dwt, maxRange) : Math.max(dwt, -maxRange);
    const dh = dht > 0 ? Math.min(dht, maxRange) : Math.max(dht, -maxRange);
    const bounds = {
      top: coordinate.lat + dw,
      bottom: coordinate.lat - dw,
      left: coordinate.lng - dh,
      right: coordinate.lng + dh
    };
    this.props.actions.loadData(bounds.left, bounds.bottom, bounds.right, bounds.top, this.state.roadOption);
  }

  bindMapReference(map) {
    this.map = map; 
  }

  render() {
    const { left, bottom, right, top } = this.props.bounds;
    const boundArray = [[bottom, left], [top, right]];
    const bounds = new LatLngBounds(new LatLng(bottom, left), new LatLng(top, right));

    return (
      <div>      
        <div className="leaflet-container">
          <Map 
            bounds={bounds} 
            onViewportChanged={this.onViewportChanged} 
            ref={this.bindMapReference} 
          >
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </Map>
        </div>
        <Paper className={this.props.classes.paper}>
          <Typography variant="subheading" align="center" gutterBottom>Bounds Settings</Typography>
          <AddressLookup onCoordinateChange={this.onAddressLookup}/>
          <BoundsForm />
        </Paper>
      </div>
    );
  }
}

MapContainer.propTypes = {
  classes: PropTypes.object,
  actions: PropTypes.object,
  bounds: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    bounds: state.data.bounds
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators({ loadData, updateBounds }, dispatch)
  };
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MapContainer));