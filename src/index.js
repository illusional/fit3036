import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import CssBaseline from 'material-ui/CssBaseline';

import routes from './routes';
import './styles/styles.css';
import 'typeface-roboto';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/toastr/build/toastr.min.css';

import * as calculationApi from './actions/dataActions';
import App from './components/App';


const store = configureStore();

let state = store.getState();
let {left, bottom, right, top} = state.data.bounds;
store.dispatch(calculationApi.loadData(left, bottom, right, top));

render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline />
      <App />
    </React.Fragment>
  </Provider>,
  document.getElementById('app')
);