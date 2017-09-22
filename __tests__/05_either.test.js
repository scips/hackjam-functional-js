import {left, right, either} from '../lib';
import {shouldBeAFunction, shouldRessembleEither, getCalls} from './utils';


describe('Either or', () => {
  describe('Left and right', () => {
    test('They should be functions', () => {
      shouldBeAFunction(left);
      shouldBeAFunction(right);
    });

    describe('They should both implement the following methods',() => {
      test('map', () => {
        shouldBeAFunction(left().map);
        shouldBeAFunction(right().map);
      });

      test('fold', () => {
        shouldBeAFunction(left().fold);
        shouldBeAFunction(right().map);
      });
    });
  });

  describe('Left', () => {
    describe('map', () => {
      test('It should not call the functor passed to it', () => {
        const mockFunction = jest.fn();
        left().map(mockFunction);
        expect(mockFunction.mock.calls.length).toEqual(0);
      });
      test('It should return a new left', () => {
        shouldRessembleEither(left().map(x => x));
      });
    });
    describe('fold', () => {
      test('should call the first function passed to it', () => {
        const mockLeft = jest.fn();
        mockLeft.mockReturnValueOnce('Left mock function');
        const mockRight = jest.fn();
        mockRight.mockReturnValueOnce('Left mock function');
        const res = left().fold(mockLeft, mockRight);
        expect(getCalls(mockLeft)).toEqual(1);
        expect(getCalls(mockRight)).toEqual(0);
      });

      test('It should return the result of the first function passed to it', () => {
        const mockLeft = jest.fn();
        mockLeft.mockReturnValueOnce('Left mock function');
        const mockRight = jest.fn();
        const res = left().fold(mockLeft, mockRight);
        expect(res).toEqual('Left mock function');
      });

      test('It should passed the value received by the left to the first function passed to the left', () => {
        const mockLeft = jest.fn();
        const mockRight = jest.fn();
        left('My super arg').fold(mockLeft, mockRight);
        expect(mockLeft).toBeCalledWith('My super arg');
      });
    });
  });

  describe('Right', () => {
    describe('map', () => {
      test('It should call the functor passed to it and apply it on the value stored in the right', () => {
        const mockFunction = jest.fn();
        right('Hello').map(mockFunction);
        expect(mockFunction).toBeCalledWith('Hello');
      });
      test('It should return a new right', () => {
        shouldRessembleEither(right().map(x => x));
      });
    });
    describe('fold', () => {
      test('should call the first second passed to it', () => {
        const mockLeft = jest.fn();
        const mockRight = jest.fn();
        right(45).fold(mockLeft, mockRight);
        expect(getCalls(mockLeft)).toEqual(0);
        expect(mockRight).toBeCalledWith(45);
      });
    });
  });

  describe('Either', () => {
    test('It should be a function', () => {
      expect(typeof either).toEqual('function');
    });

    test('It takes one parameter', () => {
      expect(either.length).toEqual(1);
    });

    test('It should return a left or a right depending on the input', () => {
      const mockLeft = jest.fn();
      const mockRight = jest.fn();
      either(null).fold(mockLeft, mockRight);
      expect(getCalls(mockLeft)).toEqual(1);
      expect(getCalls(mockRight)).toEqual(0);
      mockLeft.mockClear();
      mockRight.mockClear();
      either(1).fold(mockLeft, mockRight);
      expect(getCalls(mockLeft)).toEqual(0);
      expect(getCalls(mockRight)).toEqual(1);
    });
  });

  describe('Real world use cases', () => {
    test('React components', () => {
      const getComponent = (props) => {
        const {users} = props;
        /**
         * Some buisness logic here
         */
        return !users ? left('No users found') : right(users);
      }

      const myErrComponent = msg => {
        /* Some react component here */
        return `<h1>${msg}</h1>`;
      }

      const myUsersComponent = msg => {
        /* another component here */
      }

      const props = {};
      const component = getComponent(props)
        .fold(myErrComponent, myUsersComponent);
      expect(component).toEqual('<h1>No users found</h1>');
    });

    test('Try/catch', () => {
      const tryCatch = f => {
        try {
          return right(f());
        } catch(e){
          return left(e);
        }
      };

      const shouldNotThrow = () => `I did not throw :D` ;
      const shouldThrow = () => {
        throw new Error('Big scarry mistake');
      }
      const identity = x => x;
      expect(tryCatch(shouldNotThrow)
        .fold(identity, identity)).toEqual('I did not throw :D');

      expect(tryCatch(shouldThrow)
        .fold(identity, identity)).toEqual(new Error('Big scarry mistake'));
    });
  });
});
