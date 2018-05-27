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

function to5DP(n) {
    const p = Math.pow(10, 5);
    return Math.round(n*p)/p;
}

export default function dataReducer(state=intialState.data, action) {

    if (action.type == types.DATA_BOUNDS_CHANGED) {
        const {left, right, top, bottom} = action.payload;
        const bounds = {
            left: to5DP(left),
            right: to5DP(right),
            top: to5DP(top),
            bottom: to5DP(bottom)
        };
        return Object.assign({}, state, { bounds });
    }

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