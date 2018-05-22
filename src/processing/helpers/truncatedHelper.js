/**
 * 
 * @param {Array<Node>} orderedNodes 
 * @param {Object} bounds 
 */
function getTruncated(orderedNodes, bounds, nodeIdToRoad) {
    if (orderedNodes.length == 0) return orderedNodes;

    const firstIsInBounds = orderedNodes[0].inBounds(bounds);
    const lastIsInBounds = orderedNodes[orderedNodes.length-1].inBounds(bounds);

    if (firstIsInBounds && lastIsInBounds) { return orderedNodes; }
    if (!firstIsInBounds && !lastIsInBounds) { return []; }

    if (firstIsInBounds) {
        // keep the start
        let i = orderedNodes.length-1;
        while (i > 0 && !orderedNodes[i].inBounds(bounds) && nodeIdToRoad[orderedNodes[i].id].length == 1) { i--; }
        return orderedNodes.slice(0, i);

    } else {
        // remove from the start
        let i = 0;
        while (i < orderedNodes.length && !orderedNodes[i].inBounds(bounds) && nodeIdToRoad[orderedNodes[i].id].length == 1) { i++; }
        return orderedNodes.slice(i);
    }
}

export default { getTruncated };