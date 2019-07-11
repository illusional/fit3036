import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from '@material-ui/core';
import { loadData, updateBounds } from '../../data/actions/dataActions';

import BoundsForm from './BoundsForm';
import AddressLookup from './AddressLookup';

import NumberFormat from 'react-number-format';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { LatLng, LatLngBounds } from "leaflet";
import { Map, TileLayer, Rectangle } from 'react-leaflet';


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

  bindMapReference(map) {
    this.map = map; 
  }

  render() {
    const { left, bottom, right, top } = this.props.bounds;
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