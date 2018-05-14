import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Results from './Results/Results';
import Configuration from './Results/Configuration';
import * as configActions from '../actions/configActions';

import Header from '../components/common/Header';

import { loadData } from '../actions/dataActions';
import MapContainer from './map/MapContainer';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000'
    }
  }
});

const App = ({ actions, bounds, types, roads, config, dataError }) => {

  const retryLoad = () => {
    const { left, bottom, right, top } = this.props.bounds;
    actions.loadData(left, bottom, right, top);
  };

  return (
    <div>
      <Header />
      <div style={{display:"flex", flexDirection:"row", padding: "10px"}}>
        <div style={{width: "300px", padding: "10px"}}>
          <Results 
            roads={roads} 
            config={config}
            error={dataError}
            retry={retryLoad}
          />
          <Configuration 
            types={config.types} 
            roads={config.roads}
            updateType={actions.updateType}
            updateRoad={actions.updateRoad}
          />                
        </div>
        <div style={{width:"auto"}}>
          <MapContainer />
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  roads: PropTypes.array,
  config: PropTypes.object,
  bounds: PropTypes.object,
  dataError: PropTypes.string,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
      bounds: state.data.bounds,
      roads: state.data.roads,
      config: state.config,
      dataError: state.data.error
    };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...configActions, loadData };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);