import {maybe, nothing, left, right} from '../lib';
import {shouldBeAFunction, shouldBeAMaybe, shouldBeNothing, shouldRessembleAMaybe} from './utils';

const mockUser = {
  name: {
    firstName: 'Antonio',
    lastName: 'Calapez'
  },
  company: 'Hackages',
  address: {
    country: 'belgium'
  }
}

describe('The Maybe operator', () => {
  test('It should be a function', () => {
    shouldBeAFunction(maybe);
  });

  describe('The basis', () => {
    describe('maybe', () => {
      describe('It should return the following properties:', () => {
        const res = maybe(3);
        test('map', () => {
          shouldBeAFunction(res.map);
        });
    
        test('chain', () => {
          shouldBeAFunction(res.fold);
        });
    
        test('fold', () => {
          shouldBeAFunction(res.fold);
        });
      });
    
      test('It should be able to extract the value we passed using fold', () => {
        const res = maybe(3).fold();
        expect(res).toEqual(3);
      });
    
      describe('It should be mappable', () => {
        const res = maybe(3).map(x => x * 2);
        test('It should return a new maybe when mapping', () => {
          shouldRessembleAMaybe(res);
        });
        test('It should apply f to x', () => {
          expect(res.fold()).toEqual(6);
        });
      });
  
      test('It should be chainable', () => {
        const getMaybePlus3 = (x) => maybe(x + 3);
        const res = maybe(5).chain(x => getMaybePlus3(x));
        shouldBeAMaybe(res);
        expect(res.fold()).toEqual(8);
      });
    });

    describe('nothing', () => {
      test('It should have the same API as maybe', () => {
        const res = nothing();
        shouldRessembleAMaybe(res);
      });

      describe('Map', () => {
        test('It should not apply the function passed to it', () => {
          const mockFunction = jest.fn();
          const res = nothing(null).map(mockFunction);
          expect(mockFunction.mock.calls.length).toEqual(0);
        });

        test('It should return a nothing when mapped over', () => {
          const mockFunction = jest.fn();
          const res = nothing(null).map(mockFunction).map(mockFunction);
          expect(mockFunction.mock.calls.length).toEqual(0);
        });
      });
    });
  });

  describe('More advanced concepts', () => {
    describe('mapping', () => {
      test('If the result of the map is null it should return a nothing', () => {
        const res = maybe(mockUser.company).map(company => company.employes);
        shouldBeNothing(res);
      });

      test('If the value stored in the maybe is null it should not execute the function passed to the map', () => {
        const mockFunction = jest.fn();
        maybe(null).map(mockFunction);
        expect(mockFunction.mock.calls.length).toEqual(0);
      });
    });

    describe('only null or undefined values should be converted to nothing()', () => {
      shouldBeAMaybe(maybe(false));
      shouldBeAMaybe(maybe(0));
      shouldBeAMaybe(maybe(''));
      shouldBeAMaybe(maybe([]));
      shouldBeNothing(maybe(undefined));
      shouldBeNothing(maybe(null));
    });
  });

  describe('Real use cases', () => {
    const either = x => x ? right(x) : left(x);
    const prop = key => obj => obj[key];
    const identity = x => x;

    describe('Extract a deeply nested value in an object', () => {
      const mockFunction = jest.fn();
      const mockMaybe = maybe(mockUser);

      const lastName = mockMaybe
        .map(prop('name'))
        .map(prop('lastName'))
        .chain(either)
        .fold(() => 'doe', x => x);

      expect(lastName).toEqual('Calapez');

      const fooBar = mockMaybe
        .map(prop('name'))
        .map(prop('lastName'))
        .map(prop('lala'))
        .map(mockFunction)
        .map(prop('this'))
        .map(prop('doesnt'))
        .map(prop('exist'))
        .map(mockFunction)
        .map(prop('either'))
        .chain(either)
        .fold(() => 'Using either we get error handling out of the box!', identity);

      expect(fooBar).toEqual('Using either we get error handling out of the box!');
      expect(mockFunction.mock.calls.length).toEqual(0);

      const banners = {portugal: '🇵🇹', usa: '🇺🇸', france: '🇫🇷', belgium: '🇧🇪'}; 

      const identity = x => x;

      const getBanner = country => maybe(banners[country]);

      const countryBanner = mockMaybe
        .map(prop('address'))
        .map(prop('country'))
        .chain(getBanner)
        .chain(either)
        .fold(() => '🇨🇦', identity);

      expect(countryBanner).toEqual('🇧🇪');
    });
  });
});

