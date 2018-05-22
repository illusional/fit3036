import * as types from '../actions/actionTypes';
import intialState from './initialState';

const typeDefaults = {
    "cycleway": false,
    "footway": false,
    "path": false,
    "pedestrian" : false,
    "unclassified" : false,
    "steps": false
    // "residential": true,
    // "service": true,
    // "tertiary": true,
    // "trunk": true
};

const roadDefaults = {
    "unnamed" : false
};


export default function resultReducer(state=intialState.config, action) {
    const { payload } = action;

    if (action.type === types.CONFIG_UPDATE_ROAD) {
      const modifiedRoads = Object.keys(payload)
        .reduce((m, k) => { 
          m[k] = Object.assign({}, state.roads[k], { on: payload[k] });
          return m;
        }, {});
      const roads = Object.assign({}, state.roads, modifiedRoads);
      return Object.assign({}, state, { roads });
    }
    if (action.type === types.CONFIG_UPDATE_TYPE) {
      const modifiedTypes = Object.keys(payload)
        .reduce((m, k) => {
            m[k] = Object.assign({}, state.types[k], { on: payload[k] });
            return m;   
        }, {});
      const ts = Object.assign({}, state.types, modifiedTypes);

      return Object.assign({}, state, { types: ts });
    }
    if (action.type === types.CONFIG_UPDATE_MODE) {
      return Object.assign({}, state, { mode: payload });
    }

    if (action.type === types.DATA_LOAD_START) {
        return Object.assign({}, state, { types: undefined, roads: undefined });
    }
    if (action.type === types.DATA_LOAD_FULFILLED) {
        const rs = payload.roadNames;
        const tps = payload.types;
        return Object.assign({}, state, {
            roads: Object.keys(rs).reduce((m, val) => {
                const def = roadDefaults[val];
                m[val] = Object.assign(rs[val], { on: def !== undefined ? def : true });
                return m;
            }, {}),
            types: Object.keys(tps).reduce((m, val) => {
                const def = typeDefaults[val];
                m[val] = Object.assign({area: tps[val] }, { on: def !== undefined ? def : true });
                return m;
            }, {})
        });
    }


    return state;
}