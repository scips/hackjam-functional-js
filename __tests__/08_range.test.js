import {range} from '../lib';
import {shouldBeAFunction} from './utils';

describe('range', () => {
  test('It should be a function', () => {
    shouldBeAFunction(range);
  });

  test('It should return an array', () => {
    expect(Array.isArray(range(2))).toBeTruthy();
  });

  test('It should return values from 0 to x if x is the only argument (eg: 2 -> [0, 1])', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  test('It should return values from x to y if passed two arguments (eg: 3, 6 -> [3, 4, 5])', () => {
    expect(range(3, 7)).toEqual([3, 4, 5, 6]);
  });

  test('It should handle negative ranges (eg: 7, 4 -> [7, 6, 5])', () => {
    expect(range(7, 4)).toEqual([7, 6, 5]);
  });
});
