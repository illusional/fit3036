import ReducedNode from '../models/ReducedNode';

/**
 * 
 * @param {Array<ReducedNode>} orderedNodes 
 * @param {Object} bounds 
 */
function getIntersectedPoints(orderedNodes, bounds) {
    if (orderedNodes.length == 0) return orderedNodes;

    const firstIsInBounds = orderedNodes[0].inBounds(bounds);
    const lastIsInBounds = orderedNodes[orderedNodes.length-1].inBounds(bounds);
    if (firstIsInBounds && lastIsInBounds) { return orderedNodes; }
    if (!firstIsInBounds && !lastIsInBounds) { return []; }

    let i = 0;

    if (firstIsInBounds) {
        // keep the start
        while (i < orderedNodes.length && orderedNodes[i].inBounds(bounds)) { i++; }
        const newPoint = getIntersectedPoint(bounds, orderedNodes[i-1], orderedNodes[i]);
        return orderedNodes.slice(0, i).concat(newPoint);

    } else {
        // remove from the start
        while (i < orderedNodes.length && !orderedNodes[i].inBounds(bounds)) { i++; }
        const newPoint = getIntersectedPoint(bounds, orderedNodes[i-1], orderedNodes[i]);
        return [newPoint].concat(orderedNodes.slice(i));
    }
}

/**
 * 
 * @param {Object} bounds 
 * @param {ReducedNode} n1 
 * @param {ReducedNode} n2 
 */
function getIntersectedPoint(bounds, n1, n2) {
    const [inside, outside] = n1.inBounds(bounds) ? [n1, n2] : [n2, n1];

    const newId = `${inside.id}_${outside.id}_new`;

    const isLeft = outside.lon < inside.lon;
    const gradient = (outside.lat - inside.lat)/(outside.lon - inside.lon);

    if (isLeft) {
        if (gradient < (bounds.top - inside.lat)/(bounds.left - inside.lat)){
            // Top intersection
            return new ReducedNode(newId, inside.lon + (bounds.top - inside.lat)/gradient, bounds.top);
        } else if (gradient > (bounds.bottom - inside.lon)/(bounds.left - inside.lat)) {
            // Bottom intersection
            return new ReducedNode(newId, inside.lat + (bounds.bottom - inside.lon)/gradient, bounds.bottom);
        } else {
            // left intersection
            return new ReducedNode(newId, bounds.left, inside.lat + (bounds.left - inside.lat)*gradient);
        }
    } else {
        if (gradient > (bounds.top - inside.lon)/(bounds.right - inside.lat)) {
            // Top intersection
            return new ReducedNode(newId, inside.lon + (bounds.top - inside.lat)/gradient, bounds.top);
        } else if (gradient < (bounds.bottom - inside.lon)/(bounds.right - inside.lat)) {
            // Bottom intersection
            return new ReducedNode(newId, inside.lon + (bounds.bottom - inside.lat)/gradient, bounds.bottom);
        } else {
            return new ReducedNode(newId, bounds.right, inside.lat + (bounds.right - inside.lon)*gradient);
        }
    }
}

export default {
    getIntersectedPoints,
    getIntersectedPoint
};