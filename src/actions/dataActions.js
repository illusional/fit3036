import * as types from './actionTypes';
import calculationApi from '../api/calculationApi';

export function beginDataLoad() {
    return { type: types.DATA_LOAD_START };
}

export function loadData(left, bottom, right, top, roadOption) {
    return function (dispatch, getState) {
        dispatch(beginDataLoad());
        return calculationApi.loadData(left, bottom, right, top, roadOption)
        .then(resp => {
            if (resp && resp.data.success) {
                dispatch({ type: types.DATA_LOAD_FULFILLED, payload: resp.data });
            } else {
                const message = resp && resp.message || "An error occurred while calculating road surface area";
                dispatch({ type: types.DATA_LOAD_REJECTED, payload: message });

            }
        }).catch(er => {
            dispatch({ type: types.DATA_LOAD_REJECTED, payload: er.message });
        });
    };
}