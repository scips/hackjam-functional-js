import {pipe} from '../lib';
import {shouldBeAFunction} from './utils';

const removeDotsAndCommas = x => x.replace(/(\.|\,)/g, '');
const splitOnSpaces = x => x.split(' ');
const lowerCase = x => x.map(e => e.toLowerCase());
const joinWithDashes = x => x.join('-');

const urlSlug = pipe(removeDotsAndCommas, splitOnSpaces, lowerCase, joinWithDashes);

describe('pipe', () => {
  test('It should be a function', () => {
    shouldBeAFunction(pipe);
  });

  test('It should return a function', () => {
    shouldBeAFunction(urlSlug);
  });
  
  test('It should run the functions from left to right', () => {
    const addJohn = x => `${x} John`;
    const upperCase = x => x.toUpperCase();

    const helloJohn = pipe(addJohn, upperCase);
    expect(helloJohn('Hello,')).toEqual('HELLO, JOHN');

    expect(urlSlug('The name is bond. James, Bond.')).toEqual('the-name-is-bond-james-bond');
  });
});
