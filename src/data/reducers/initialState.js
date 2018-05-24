import Mode from '../../processing/mode';

export default {
    data: {
        // Vermont South
        bounds: {
            // Nb: horizontal: longitude, vertical: latitude
            left: 145.12796,
            right: 145.14255,
            bottom: -37.91394,
            top: -37.90716
        },
        roads: undefined,
        error: undefined
    },
    config: {
        roads: undefined,
        types: undefined,
        mode: Mode.intersect
    }
};