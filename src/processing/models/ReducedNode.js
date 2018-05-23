/** Container for latitude and longitude */
export default class ReducedNode {
    constructor(id, lat, lon) {
        this.id = id;
        this.lat = Number(lat);
        this.lon = Number(lon);
    }

    inBounds(bounds) {
        return (bounds.left < this.lon && this.lon < bounds.right)
            && (bounds.bottom < this.lat && this.lat < bounds.top);
    }
}