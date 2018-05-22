import * as types from './actionTypes';
import calculationApi from '../api/calculationApi';

export function beginDataLoad() {
    return { type: types.DATA_LOAD_START };
}

export function boundsChanged(left, bottom, right, top) {
    return {type: types.DATA_BOUNDS_CHANGED, payload: { left, right, top, bottom }};
}

export function loadData(left, bottom, right, top, roadOption) {
    return function (dispatch, getState) {
        dispatch(boundsChanged(left, bottom, right, top));
        dispatch(beginDataLoad());
        return calculationApi.loadData(left, bottom, right, top, roadOption)
        .then(resp => {
            if (resp && resp.data.success) {
                dispatch({ type: types.DATA_LOAD_FULFILLED, payload: resp.data });
            } else {
                const message = resp && resp.data && resp.data.message || "An error occurred while calculating road surface area";
                dispatch({ type: types.DATA_LOAD_REJECTED, payload: message });

            }
        }).catch(er => {
            console.log(er.stack);
            dispatch({ type: types.DATA_LOAD_REJECTED, payload: er.message });
        });
    };
}

export function updateBounds(left, bottom, right, top) {
    return (dispatch, getState) => {
        dispatch(boundsChanged(left, bottom, right, top));
    };
}