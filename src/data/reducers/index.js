import { combineReducers } from 'redux';

// import reducers
import data from './dataReducer';
import config from './configReducer';

// bind reducers
const rootReducer = combineReducers({
    data,
    config
});

export default rootReducer;
