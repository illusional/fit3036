import * as types from './actionTypes';

export function updateRoad(road, value) {
    return { type: types.CONFIG_UPDATE_ROAD, payload: {[road]: value} };
}

export function updateType(type, value) {
    return { type: types.CONFIG_UPDATE_TYPE, payload: {[type]: value} };
}