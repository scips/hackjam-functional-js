import {curry} from '../lib';
import {shouldBeAFunction} from './utils';

const identity = x => x;

describe('Curry', () => {
  test('It should be a funcion', () => {
    shouldBeAFunction(curry);
  });

  test('It should take a function as its first argument then a bunch of arguments and return a function', () => {
    shouldBeAFunction(curry(identity, 1337));
  });

  test('It should apply the parameters to the function we passed to it', () => {
    const add = (x, y) => x + y;
    const add2 = curry(add, 2);
    expect(add2(5)).toEqual(7);

    const addNumbers = (...numbers) => numbers.reduce((acc, next) => acc + next, 0);
    const numbers = [2, 5, 2, 1, 5, 6];
    const addLotsOfThings = curry(addNumbers, ...numbers);
    expect(addLotsOfThings(32)).toEqual(numbers.reduce((acc, next) => acc + next, 0) + 32);
  });

  test('It should return us a function that takes an infinity of parameters', () => {
    const add = (...numbers) => numbers.reduce((acc, next) => acc + next, 0);
    const add2and5 = curry(add, 2, 5);
    expect(add2and5(1, 3, 5)).toEqual(2 + 5 + 5+ 3 + 1);
  });
});
