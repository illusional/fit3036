import * as types from '../actions/actionTypes';
import intialState from './initialState';

// {
//     bounds: {
//         left: 145.1876,
//         bottom: -37.8587,
//         right: 145.2049,
//         top: -37.8495
//     },
//     data: {

//     },
//     unit: null
// }

export default function dataReducer(state=intialState.data, action) {

    if (action.type === types.DATA_LOAD_START) {
        return Object.assign({}, state, { roads: undefined, error: undefined });
    }

    if (action.type === types.DATA_LOAD_FULFILLED) {
        return Object.assign({}, state, {
            roads: action.payload.roads,
            error: undefined
        });
    }

    if (action.type === types.DATA_LOAD_REJECTED) {
        return Object.assign({}, state, { error: action.payload });
    }


    return state;
}