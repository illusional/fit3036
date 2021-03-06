import expect from 'expect';
import ReducedNode from './models/ReducedNode';
import { distanceBetweenAllPoints, distanceBetweenCoordinates } from './calculation';

const p1_1 = new ReducedNode('in1', -37.908, 145.13796);
const p1_2 = new ReducedNode('out1', -37.905, 145.11796);
const p1_expected = 1786.26;

const p2_1 = new ReducedNode('out2', -38.2485653, 145.659277);
const p2_2 = new ReducedNode('out3', -38.2483678, 145.6590903);
const p2_expected = 27.35;

const p5 = new ReducedNode('out3', -37.91, 145.143);
// distanceBetweenCoordinates
describe('Haversine formula', () => {

    it('haversine-1', () => {
        const distance = distanceBetweenCoordinates(p1_1, p1_2);
        expect(distance).toBeApproximately(p1_expected, -2);
    });

    it('haversine-1', () => {
        const distance = distanceBetweenCoordinates(p2_1, p2_2);
        expect(distance).toBeApproximately(p2_expected, -2);
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
        expect(distanceBetweenAllPoints([p1_1, p1_2])).toBeApproximately(p1_expected, -2);
    });
});

// distanceBetweenAllPoints
