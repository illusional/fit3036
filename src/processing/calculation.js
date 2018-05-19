


function distanceBetweenAllPoints(pts) {
    let distance = 0.0;
    for (let i=0; i < pts.length-1; i++) {
        distance += distanceBetweenCoordinates(pts[i], pts[i+1]);
    }
    return distance;
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function distanceBetweenCoordinates(p1, p2) {
    // φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km) 
    // a = sin²(φB - φA/2) + cos φA * cos φB * sin²(λB - λA/2)
    // c = 2 * atan2( √a, √(1−a) )
    // d = R ⋅ c

    // Coordinates in decimal degrees (e.g. 2.89078, 12.79797)
    const lat1 = p1.lat;
    const lon1 = p2.lon;
    const lat2 = p2.lat;
    const lon2 = p2.lon;

    const R = 6371000;  //  radius of Earth in meters
    const phi_1 = toRadians(lat1);
    const phi_2 = toRadians(lat2);

    const delta_phi = toRadians(lat2 - lat1);
    const delta_lambda = toRadians(lon2 - lon1);

    const a = Math.pow(Math.sin(delta_phi / 2.0), 2) + Math.cos(phi_1) * Math.cos(phi_2) * Math.pow(Math.sin(delta_lambda / 2.0), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const meters = R * c;  // output distance in meters

    return meters;
}


export default function (nodes, road) {

    let width = road.tags.width || 8.0;
    // calculate total distance between nodes
    const orderedCoordinatePairs = road.nds.map((nd, idx) => nodes[nd]);
    let distance = distanceBetweenAllPoints(orderedCoordinatePairs);

    const area = width * distance;

    return {
        area, unit: "m^2"
    };
}