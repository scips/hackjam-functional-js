import {compose} from '../lib';
import {shouldBeAFunction, shouldTakeXArguments} from './utils';

const addJon = phrase => `${phrase}, Jon snow`;
const upperCase = phrase => phrase.toUpperCase();

const addJonThenUpperCase = compose(upperCase, addJon);

describe('compose', () => {
  test('It should be a function', () => {
    shouldBeAFunction(compose);
  });

  test('It should take two functions as parameters parameters', () => {
    expect(compose.length).toEqual(2);
  });

  test('It should return a function', () => {
    shouldBeAFunction(addJonThenUpperCase);
  });

  test('The returned function should take 0 or more arguments', () => {
    const identity = (...args) => args;
    const composedIdentity = compose(identity, identity);
    expect(composedIdentity("one arg")).toEqual([["one arg"]]);
    expect(composedIdentity("one arg", "two args")).toEqual([["one arg", "two args"]]);
  });

  test('It should apply the functions from right to left', () => {
    const result = addJonThenUpperCase("You know nothing");
    expect(result).toEqual("YOU KNOW NOTHING, JON SNOW");
  });
});
