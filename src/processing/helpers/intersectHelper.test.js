import expect from 'expect';
import ReducedNode from '../models/ReducedNode';
import intersectHelper from './intersectHelper';

expect.extend({
    toBeWithin (received, [arg1, arg2]) {
      return {
        message: () => `expected ${received} to be within ${arg1} and ${arg2}`,
        pass: arg1 <= received && received <= arg2
      };
    }
  });

const bounds = {
    // Nb: horizontal: longitude, vertical: latitude
    top: -37.90716,
    bottom: -37.91394,
    left: 145.12796,
    right: 145.14255
};
const in1 = new ReducedNode('in1', -37.908, 145.13796);
const out1 = new ReducedNode('out1', -37.905, 145.11796);
const out2 = new ReducedNode('out2', -37.90, 145.1172);


describe('Intersection test', () => {
    // const expected = (145.13235999999998, -37.90716)
    const [ln1, ln2] = [145.13235, 145.132565];
    const [lt1, lt2] = [-37.9072, -37.9071];
    const point = intersectHelper.getIntersectedPoint(bounds, in1, out1);
    it('intersection-test1-lat', () => {
        expect(point.lat).toBeWithin([lt1, lt2]);
    });
    it('intersection-test1-lon', () => {
        expect(point.lon).toBeWithin([ln1, ln2]);
    });
});

describe('Reduction and intersection test', () => {
    const reduced = intersectHelper.getIntersectedPoints([in1, out2, out1], bounds);
    // expected last point: (-37.90716, 145.13578019999997)
    const [ln1, ln2] = [145.135780, 145.135781];
    const [lt1, lt2] = [-37.9072, -37.9071];

    it ('reduction-test1-length', () => {
        expect(reduced.length).toBe(2);
    });
    it ('reduction-test1-lat', () => {
        expect(reduced[1].lat).toBeWithin([lt1, lt2]);
    });
    it ('reduction-test1-lon', () => {
        expect(reduced[1].lon).toBeWithin([ln1, ln2]);
    });
});

