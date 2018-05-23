import expect from 'expect';
import ReducedNode from '../models/ReducedNode';
import intersectHelper from './intersectHelper';

expect.extend({
    toBeWithin (received, [arg1, arg2]) {
      return {
        message: () => `expected ${received} to be within ${arg1} and ${arg2}`,
        pass: arg1 <= received && received <= arg2
      };
    },
    toBeApproximately (received, arg1) {
        return {
          message: () => `expected ${received} to be approximately ${arg1} +- 0.0001`,
          pass: (arg1 - 0.0001) <= received && received <= (arg1 + 0.0001)
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
const out3 = new ReducedNode('out3', -37.91, 145.10);
const out4 = new ReducedNode('out3', -37.91, 145.143);


describe('Intersection test', () => {

    // top
    // const expected = (145.13235999999998, -37.90716)
    const point1 = intersectHelper.getIntersectedPoint(bounds, in1, out1);
    it('intersection-test1-lat', () => {
        const [lt1, lt2] = [-37.9072, -37.9071];
        expect(point1.lat).toBeWithin([lt1, lt2]);
    });
    it('intersection-test1-lon', () => {
        const [ln1, ln2] = [145.13235, 145.132565];
        expect(point1.lon).toBeWithin([ln1, ln2]);
    });

    // left
    // expected (145.12796, -37.908526870389885)
    const point2 = intersectHelper.getIntersectedPoint(bounds, in1, out3);
    it('intersection-test2-lat', () => {
        const [lt1, lt2] = [-37.9086, -37.9085];
        expect(point2.lat).toBeWithin([lt1, lt2]);
    });
    it('intersection-test2-lon', () => {
        const [ln1, ln2] = [145.1279, 145.128];
        expect(point2.lon).toBeWithin([ln1, ln2]);
    });

    // right
    // expected: (145.14255, -37.909821428571426)
    const point3 = intersectHelper.getIntersectedPoint(bounds, in1, out4);
    it('intersection-test3-lat', () => {
        expect(point3.lat).toBeApproximately(-37.909821428571426);
    });
    it('intersection-test3-lon', () => {
        expect(point3.lon).toBeApproximately(145.14255);
    });
});

describe('Reduction and intersection test', () => {
    const reduced = intersectHelper.getIntersectedPoints([in1, out2, out1], bounds);
    // expected last point: (-37.90716, 145.13578019999997)

    it ('reduction-test1-length', () => {
        expect(reduced.length).toBe(2);
    });
    it ('reduction-test1-lat', () => {
        expect(reduced[1].lat).toBeApproximately(-37.90716);
    });
    it ('reduction-test1-lon', () => {
        expect(reduced[1].lon).toBeApproximately(145.13578019999997);
    });
});

