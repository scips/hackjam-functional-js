/*
* Welcome hacker, if you've got this far, you're probably a functional JS ninja already.
* Buckle up your seat belt, stretch your fingers and enjoy the ride.
*
*
* In a nutshell; Lenses are functional getter and setters
*/
import {shouldBeAFunction, shouldRessembleALens} from './utils';
import {view, set, over, lens, lensProp, lensPath, lensIndex} from '../lib';

const mockUser = {
  id: 'fB43',
  name: 'Antonio',
  company: {
    name: 'Hackages'
  }
};

const copyMockUser = {...mockUser};

const getId = obj => obj.id;
const setName = (value, obj) => ({...obj, name: value});

describe('Lenses', () => {
  describe('A simple lens', () => {
    test('Should be a function', () => {
      shouldBeAFunction(lens);
    });

    test('Should take two arguments', () => {
      expect(lens.length).toEqual(2);
    });

    test('Should return an object with a get and a set', () => {
      shouldBeAFunction(lens().get);
      shouldBeAFunction(lens().set);
    });

    test('The getter should take one parameter', () => {
      expect(lens().get.length).toEqual(1);
    });

    test('The setter should take two parameters', () => {
      expect(lens().set.length).toEqual(2);
    });

    test('The .get method should pass an object to our getter', () => {
      expect(lens(getId).get(mockUser)).toEqual('fB43');
    });

    test('The .set method should return a new object by passing an object to our setter', () => {
      const l = lens(getId, setName);
      const newUser = l.set('Peter', copyMockUser);
      expect(newUser).toEqual({...copyMockUser, name: 'Peter'});
      expect(mockUser).toEqual(copyMockUser);
    });
  });

  describe('propLens', () => {
    test('It should be a function', () => {
      shouldBeAFunction(lensProp);
    });

    test('It should ressemble a lens', () => {
      shouldRessembleALens(lensProp);
    });

    test('It should take a prop as an argument', () => {
      expect(lensProp.length).toEqual(1);
    });

    test('It should use the prop we gave it in the .get', () => {
      const l = lensProp('id');
      expect(l.get(copyMockUser)).toEqual(copyMockUser.id);
    });

    test('It should use the prop we git in the .set', () => {
      const l = lensProp('id');
      expect(l.set(42, copyMockUser)).toEqual({...mockUser, id: 42});
    });
  });

  describe("Let's build some utilitary functions to use our lenses with", () => {
    describe('view', () => {
      test('It should be a function', () => {
        shouldBeAFunction(view);
      });

      test('It should take two parameters, a lens and an object to apply that lens on', () => {
        expect(view.length).toEqual(2);
      });

      test('It should call the lense it receives with the object it receives', () => {
        const lensId = lensProp('id');
        const lensName = lensProp('name');
        expect(view(lensId, mockUser)).toEqual(mockUser.id);
        expect(view(lensName, mockUser)).toEqual(mockUser.name);
      });
    });

    describe('set', () => {
      test('It should be a function', () => {
        shouldBeAFunction(set);
      });

      test('It should take three parameters, a lens, a value, and an object to apply that lens on', () => {
        expect(set.length).toEqual(3);
      });

      test('It should call the lense it receives with the object it receives and apply the value received', () => {
        const lensId = lensProp('id');
        const lensName = lensProp('name');
        expect(set(lensId, 42, copyMockUser)).toEqual({...mockUser, id: 42});
        expect(set(lensName, 'Anita', copyMockUser)).toEqual({...mockUser, name: 'Anita'});

        expect(copyMockUser).toEqual(mockUser);
      });
    });
  });

  describe('over', () => {
    describe('Over works like set but applies a function on the recieved value instead of replacing it', () => {
      describe('over in a simple lens', () => {
        test('Lens should return a .over method', () => {
          shouldBeAFunction(lens().over);
        });

        test('It should take two arguments: a function and an object', () => {
          expect(lens().over.length).toEqual(2);
        });

        test('It should apply the function on the object it receives using the getter and setter received', () => {
          const toUpper = x => x.toUpperCase();
          const getter = x => x.name;
          const setter = (val, obj) => ({
            ...obj,
            name: val
          });
          const nameLens = lens(getter, setter);
          expect(nameLens.over(toUpper, copyMockUser)).toEqual({
            ...mockUser,
            name: 'ANTONIO'
          });
          expect(mockUser).toEqual(copyMockUser);
        });
      });
    });
    describe('Over in a prop lens', () => {
      test('lensProp should return a .over method', () => {
        shouldBeAFunction(lensProp().over);
      });

      test('It should take two arguments: a function and an object', () => {
        expect(lensProp().over.length).toEqual(2);
      });

      test('It should apply the function on the object it receives', () => {
        const name = lensProp('name');
        expect(name.over(x => x.toUpperCase(), mockUser)).toEqual({
          ...mockUser,
          name: 'ANTONIO'
        });
        expect(mockUser).toEqual(copyMockUser);
      });
    });
  });

  describe('Bonus: lensPath', () => {
    test('It should be a function', () => {
      shouldBeAFunction(lensPath);
    });

    const companyName = ['company', 'name'];
    const cnLens = lensPath(companyName);
    const toUpper = x => x.toUpperCase();

    test('It should take an array as a parameter and access values at that path', () => {
      expect(cnLens.get(mockUser)).toEqual('Hackages');
    });

    test('It should be able to set values at a given path', () => {
      expect(cnLens.set('Hackages rocks !!', copyMockUser)).toEqual({
        ...mockUser,
        company: {
          name: 'Hackages rocks !!'
        }
      });
      expect(mockUser).toEqual(copyMockUser);
    });

    test('It should be able to over value st a given path', () => {
      expect(cnLens.over(toUpper, copyMockUser)).toEqual({
        ...mockUser,
        company: {
          name: 'HACKAGES'
        }
      });
      expect(mockUser).toEqual(copyMockUser);
    });
  });

  describe('bonus: lensIndex', () => {

    const first = lensIndex(0);
    const mockValues = [0, 1, 2];

    test('It should be a function', () => {
      shouldBeAFunction(lensIndex);
    });

    test('It should take one parameter', () => {
      expect(lensIndex.length).toEqual(1);
    });

    test('It should allow us to acces values at index x', () => {
      expect(first.get(mockValues)).toEqual(0);
    });

    test('It should allow us to set values at index x', () => {
      expect(first.set(42, mockValues)).toEqual([42, 1, 2]);
    });
  });
});
