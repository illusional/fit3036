import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'remote-redux-devtools';

// const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });


export default function configureStore(initialState) {
    return createStore(
        rootReducer, 
        initialState,
        composeWithDevTools(applyMiddleware(thunk, reduxImmutableStateInvariant()))
    );
}