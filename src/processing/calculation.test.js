import expect from 'expect';
import ReducedNode from './models/ReducedNode';
import { distanceBetweenAllPoints, distanceBetweenCoordinates } from './calculation';

const p1_1 = new ReducedNode('in1', -37.908, 145.13796);
const p1_2 = new ReducedNode('out1', -37.905, 145.11796);

const p2_1 = new ReducedNode('out2', -37.853602, 145.201654);
const p2_2 = new ReducedNode('out3', -37.852240, 145.202931);
const p5 = new ReducedNode('out3', -37.91, 145.143);
// distanceBetweenCoordinates
describe('Haversine formula', () => {

    // const expected = (333.61095987)
    it('haversine-1', () => {
        const distance = distanceBetweenCoordinates(p1_1, p1_2);
        expect(distance).toBeApproximately(333.61095987);
    });

    it('haversine-1', () => {
        const distance = distanceBetweenCoordinates(p2_1, p2_2);
        expect(distance).toBeApproximately(187.52, -1);
    });
});

describe('Ordered-coordinates-test', () => {
    it('length=0', () => {
        expect(distanceBetweenAllPoints([])).toBe(0.0);
    });
    it('length=1', () => {
        expect(distanceBetweenAllPoints([p1_1])).toBe(0.0);
    });
    it('length=2', () => {
        expect(distanceBetweenAllPoints([p1_1, p1_2])).toBeApproximately(333.61095987);
    });
});

// distanceBetweenAllPoints
