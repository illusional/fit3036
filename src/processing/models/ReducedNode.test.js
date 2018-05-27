import expect from 'expect';
import ReducedNode from './ReducedNode';

// longitude increases as you go right
// latitude increases as you go up

const bounds = {
    // Nb: horizontal: longitude, vertical: latitude
    top: -37.90716,
    bottom: -37.91394,
    left: 145.12796,
    right: 145.14255
  };
  
describe('Bounds tests', () => {

    it('bounds-test1-inside', () => {
      const point = new ReducedNode('t1', -37.908, 145.13796);
      expect(point.inBounds(bounds)).toEqual(true);
    });
    it('bounds-test2-outside', () => {
      const point = new ReducedNode('t1', -37.8905, 145.11796);
      expect(point.inBounds(bounds)).toEqual(false);
    });
  });