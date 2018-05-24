import ReducedNode from '../models/ReducedNode';

/**
 * 
 * @param {Array<ReducedNode>} orderedNodes 
 * @param {Object} bounds 
 */
function getIntersectedPoints(orderedNodes, bounds) {
    if (orderedNodes.length < 2) return orderedNodes;

    const firstIsInBounds = orderedNodes[0].inBounds(bounds);
    const lastIsInBounds = orderedNodes[orderedNodes.length-1].inBounds(bounds);
    if (firstIsInBounds && lastIsInBounds) { return orderedNodes; }

    // either the first, or last nodes are out of the bounds
    // so we'll trim both sides
    // trim the start
    let i = 0;
    while (i < orderedNodes.length-1 && !orderedNodes[i].inBounds(bounds)) { i++; }
    if (i > 0) {
        // i is inside, i-1 is outside
        const newFirstPoint = getIntersectedPoint(bounds, orderedNodes[i-1], orderedNodes[i]);
        orderedNodes = [newFirstPoint].concat(orderedNodes.slice(i));
    }
    // trim the end
    let j = orderedNodes.length-1;
    while (j > 0 && !orderedNodes[j].inBounds(bounds)) { j--; }
    if (j < orderedNodes.length-1) {
        // j is inside, j+1 is outside
        const newLastNode = getIntersectedPoint(bounds, orderedNodes[j], orderedNodes[j+1]);
        orderedNodes = orderedNodes.slice(0, j+1).concat(newLastNode);
    }
    return orderedNodes;
}

/**
 * 
 * @param {Object} bounds 
 * @param {ReducedNode} n1 
 * @param {ReducedNode} n2 
 */
function getIntersectedPoint(bounds, n1, n2) {
    // console.log(n1, n2);
    const [inside, outside] = n1.inBounds(bounds) ? [n1, n2] : [n2, n1];

    const newId = `${inside.id}_${outside.id}_new`;

    const isLeft = outside.lon < inside.lon;
    const gradient = (outside.lat - inside.lat)/(outside.lon - inside.lon);

    if (isLeft) {
        // left of point
        if (gradient < (bounds.top - inside.lat)/(bounds.left - inside.lon)){
            // Top intersection
            return new ReducedNode(newId, bounds.top, inside.lon + (bounds.top - inside.lat)/gradient);
        } else if (gradient > (bounds.bottom - inside.lat)/(bounds.left - inside.lon)) {
            // Bottom intersection
            const p = new ReducedNode(newId, bounds.bottom, inside.lon + (bounds.bottom - inside.lat)/gradient);
            if (p.lon < 0) { console.log('left-bottom', p); }
            return p;
        } else {
            // left intersection
            return new ReducedNode(newId, inside.lat + (bounds.left - inside.lon)*gradient, bounds.left);
        }
    } else {
        // right of point
        if (gradient > (bounds.top - inside.lat)/(bounds.right - inside.lon)) {
            // Top intersection
            const p = new ReducedNode(newId, bounds.top, inside.lon + (bounds.top - inside.lat)/gradient);
            if (p.lon < 0) { console.log('right-top', p); }
            return p;
        } else if (gradient < (bounds.bottom - inside.lat)/(bounds.right - inside.lon)) {
            // Bottom intersection
            const p = new ReducedNode(newId, bounds.bottom, inside.lon + (bounds.bottom - inside.lat)/gradient);
            if (p.lon < 0) { console.log('right-bottom', p); }
            return p;
        } else {
            return new ReducedNode(newId, inside.lat + (bounds.right - inside.lon)*gradient, bounds.right);
        }
    }
}

export default {
    getIntersectedPoints,
    getIntersectedPoint
};