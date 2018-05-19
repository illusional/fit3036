import React from 'react';
import { render } from 'react-dom';
import configureStore from './data/store/configureStore';
import { Provider } from 'react-redux';
import CssBaseline from 'material-ui/CssBaseline';

import 'babel-polyfill';
import './styles/styles.css';
import 'typeface-roboto';

import App from './components/App';
const store = configureStore();

render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline />
      <App />
    </React.Fragment>
  </Provider>,
  document.getElementById('app')
);