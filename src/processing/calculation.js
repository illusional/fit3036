'use strict';

import Mode from './mode';
import intersectHelper from './helpers/intersectHelper';
import truncatedHelper from './helpers/truncatedHelper';
import ReducedNode from './models/ReducedNode';


// AUSTROADS (2016) Guide to Road Design Part 3: Geometric Design (4.2.4 Traffic Lane Widths - p. 44)
const DEFAULT_LANES = 2;
const DEFAULT_LANE_WIDTH = 3.5;
const DEFAULT_ROAD_PADDING = 0.9;
const DEFAULT_ROAD_WIDTH = DEFAULT_LANES * DEFAULT_LANE_WIDTH + DEFAULT_ROAD_PADDING;

/**
 * @param {Array} pts - Array of points
 * @returns {Number} the sum of the distance between successive points
 */

export function distanceBetweenAllPoints(pts) {
    let distance = 0.0;
    for (let i=1; i < pts.length; i++) {
        distance += distanceBetweenCoordinates(pts[i-1], pts[i]);
    }
    return distance;
}

/**
 * Converts degrees to radians
 * @param {Number} angle 
 * @returns {Number} angle in radians
 */
function toRadians (angle) {
    return angle * (Math.PI / 180);
}

/**
 * Javascript implementation of the Haversine (great circle) distance
 * @param {ReducedNode} p1 - Start point
 * @param {ReducedNode} p2 - Finish Point
 * @returns {Number} distance in metres
 */
export function distanceBetweenCoordinates(p1, p2) {
    // Based on: https://stackoverflow.com/a/27943
    // φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km) 
    // a = sin²(φB - φA/2) + cos φA * cos φB * sin²(λB - λA/2)
    // c = 2 * atan2( √a, √(1−a) )
    // d = R ⋅ c

    if (!p1 || !p2) { return 0.0; }

    // Coordinates in decimal degrees (e.g. 2.89078, 12.79797)
    const lat1 = p1.lat;
    const lon1 = p2.lon;
    const lat2 = p2.lat;
    const lon2 = p2.lon;

    const R = 6371500;  //  radius of Earth in meters
    const phi_1 = toRadians(lat1);
    const phi_2 = toRadians(lat2);

    const delta_phi = toRadians(lat2 - lat1);
    const delta_lambda = toRadians(lon2 - lon1);

    const a = Math.pow(Math.sin(delta_phi / 2.0), 2) + Math.cos(phi_1) * Math.cos(phi_2) * Math.pow(Math.sin(delta_lambda / 2.0), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const meters = R * c;  // output distance in meters

    return meters;
}

function getWidthFromRoad(road) {
    if (!road || !road.tags) return DEFAULT_ROAD_WIDTH;

    if (road.tags.width) return road.tags.width;

    if (road.tags.lanes) return DEFAULT_LANE_WIDTH * road.tags.lanes + DEFAULT_ROAD_PADDING;

    switch (road.highway) {
        case 'motorway': return DEFAULT_ROAD_WIDTH;
        case 'trunk': return DEFAULT_ROAD_WIDTH;
        case 'primary': return DEFAULT_ROAD_WIDTH;
        case 'secondary': return DEFAULT_ROAD_WIDTH;
        case 'tertiary': return DEFAULT_ROAD_WIDTH;
        case 'unclassified': return DEFAULT_ROAD_WIDTH;
        case 'residential': return DEFAULT_ROAD_WIDTH;
        case 'service': return DEFAULT_ROAD_WIDTH;
        case 'road': return DEFAULT_ROAD_WIDTH;

        case 'pedestrian': return DEFAULT_LANE_WIDTH;
        case 'track': return DEFAULT_LANE_WIDTH;
        case 'path': return DEFAULT_LANE_WIDTH;
        case 'cycleway': return DEFAULT_LANE_WIDTH;
    }

    return DEFAULT_ROAD_WIDTH;
}

export function getReducedOrderedNodeSet(mode, bounds, nodeRoadMap, nodes, road) {
    let allPairs = road.nds.map((nd, idx) => nodes[nd]);
    
    if (mode == Mode.include) { 
        return allPairs;
    } else if (mode == Mode.intersect) {
        return intersectHelper.getIntersectedPoints(allPairs, bounds);
    } else if (mode == Mode.truncate) {
        return truncatedHelper.getTruncated(allPairs, bounds, nodeRoadMap);
    } else {
        return allPairs;
    }
}

export function calculateRoadArea (mode, bounds, nodeRoadMap, nodes, road) {

    let width = getWidthFromRoad(road);
    // calculate total distance between nodes
    const orderedCoordinatePairs = getReducedOrderedNodeSet(mode, bounds, nodeRoadMap, nodes, road);
    let distance = distanceBetweenAllPoints(orderedCoordinatePairs);
    const area = width * distance;
    return {
        area, unit: "m^2"
    };
}