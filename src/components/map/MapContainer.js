import React from 'react';
import PropTypes from 'prop-types';
import { loadData } from '../../actions/dataActions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withStyles } from 'material-ui/styles';

import CalculationOptions from './CalculationOptions';

import { Map, TileLayer, Rectangle } from 'react-leaflet';
import { MapBounds } from 'react-leaflet-bounds';


const styles = {

};

class MapContainer extends React.Component {
  constructor(props, content) {
    super(props, content);

    this.state = {
      bounds: props.bounds,
      roadOption: "truncate"

      // [[-37.8587, 145.1876], [-37.8495, 145.2049]]
    };

    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRoadOptionChanged = this.onRoadOptionChanged.bind(this);
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
    this.setState(Object.assign({}, this.state, { bounds }));
  }

  onRoadOptionChanged(event) {
    this.setState(Object.assign({}, this.state, {roadOption: event.target.value}));
  }


  render() {

    const { left, bottom, right, top } = this.state.bounds;
    const boundArray = [[bottom, left], [top, right]];
    
    return (
      <div>
      {this.state.bounds && 
      <div>
        <p>Bounds of the map are {JSON.stringify(this.state.bounds)}</p>
        <CalculationOptions roadOption={this.state.roadOption} onRoadOptionChanged={this.onRoadOptionChanged}/>
        <button onClick={this.onClick}>Load Data</button>
      </div>}
      
      <div className="leaflet-container">
        <br />
        <Map 
          bounds={boundArray} 
          onViewportChanged={this.onViewportChanged} 
          ref={(map) => { this.map = map; }} 
        >
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    </div>
    );
  }
}

MapContainer.propTypes = {
  bounds: PropTypes.object,
  loadData: PropTypes.func
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