import {lazyBox} from '../lib';

const dummyFunction = () => 42;

describe('Lazy Box', () => {
  describe('The structure', () => {
    test('It should be a function', () => {
      expect(typeof lazyBox).toEqual('function');
    });

    describe('It should return us an object with the following methods', () => {
      const box = lazyBox(dummyFunction);
      test('map', () => {
        expect(typeof box.map).toEqual('function');
      });

      test('fold', () => {
        expect(typeof box.fold).toEqual('function');
      });
    });
  });

  describe('Making it work', () => {
    test('It should not run the function it receives before we call fold on it', () => {
      const mockFn = jest.fn();
      const box = lazyBox(mockFn);
      expect(mockFn.mock.calls.length).toEqual(0);

      box.map(mockFn);
      expect(mockFn.mock.calls.length).toEqual(0);

      box.fold(mockFn);
      expect(mockFn.mock.calls.length).toEqual(2);

      mockFn.mockClear();

      box.map(mockFn).map(mockFn).map(mockFn).map(mockFn).fold(mockFn);
      expect(mockFn.mock.calls.length).toEqual(6);
    });
  });

  test('It should call the functions from left to right', () => {
    const multiplyByTwo = x => x * 2;
    const add4 = x => x + 4;
    const result = lazyBox(dummyFunction).map(multiplyByTwo).map(add4).fold(x => x);
    expect(result).toEqual(88);
  });
});
