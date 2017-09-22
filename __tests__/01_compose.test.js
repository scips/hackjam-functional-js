import {compose} from '../lib';
import {shouldBeAFunction} from './utils';

const multiplyByTwo = x => x*2;
const addOne = x => x + 1;
const addOneThenMultiplyByTwo = compose(multiplyByTwo, addOne);

describe('compose', () => {
  test('It should be a function', () => {
    shouldBeAFunction(compose);
  });

  test('It should take two parameters', () => {
    expect(compose.length).toEqual(2);
  });

  test('It should return a function', () => {
    shouldBeAFunction(addOneThenMultiplyByTwo);
  });

  test('It should apply the functions from right to left', () => {
    const result = addOneThenMultiplyByTwo(4);
    expect(result).toEqual(10);
  });
});
