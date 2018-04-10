import * as types from '../actions/actionTypes';
import intialState from './initialState';

const typeDefaults = {
    "cycleway": false,
    "footway": false,
    "path": false,
    "residential": true,
    "service": true,
    "tertiary": true,
    "trunk": true
};


export default function resultReducer(state=intialState.config, action) {
    const { payload } = action;

    if (action.type === types.CONFIG_UPDATE_ROAD) {
        const roads = Object.assign({}, state.roads, payload);
        return Object.assign({}, state, { roads });
    }
    if (action.type === types.CONFIG_UPDATE_TYPE) {
        const types = Object.assign({}, state.types, payload);
        return Object.assign({}, state, { types });
    }
    if (action.type === types.DATA_LOAD_START) {
        return Object.assign({}, state, { types: undefined, roads: undefined });
    }
    if (action.type === types.DATA_LOAD_FULFILLED) {
        const roads = Array.from(new Set(payload.roads.map((val, idx) => val.name)));
        return {
            roads: roads.reduce((m, val) => {
                m[val] = true;
                return m;
            }, {}),
            types: payload.types.reduce((m, val) => {
                const def = typeDefaults[val];
                m[val] = def !== undefined ? def : true;
                return m;
            }, {})
        };
    }


    return state;
}