import ReducedNode from '../models/ReducedNode';

/**
 * 
 * @param {Array<ReducedNode>} orderedNodes 
 * @param {Object} bounds 
 */
function getTruncated(orderedNodes, bounds, nodeIdToRoad) {
    if (orderedNodes.length == 0) return orderedNodes;

    const firstIsInBounds = orderedNodes[0].inBounds(bounds);
    const lastIsInBounds = orderedNodes[orderedNodes.length-1].inBounds(bounds);

    if (firstIsInBounds && lastIsInBounds) { return orderedNodes; }


    let i = 0;
    while (i < orderedNodes.length-1 && !orderedNodes[i].inBounds(bounds) && nodeIdToRoad[orderedNodes[i].id].length == 1) { i++; }
    if (i > 0) {
        // i is inside, i-1 is outside
        orderedNodes = orderedNodes.slice(i);
    }
    // trim the end
    let j = orderedNodes.length-1;
    while (j > 0 && !orderedNodes[j].inBounds(bounds) && nodeIdToRoad[orderedNodes[j].id].length == 1) { j--; }
    if (j < orderedNodes.length-1) {
        // j is inside, j+1 is outside
        orderedNodes = orderedNodes.slice(0, j);
    }
    return orderedNodes;
}

export default { getTruncated };