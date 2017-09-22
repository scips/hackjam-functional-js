export const shouldBeAFunction = (func) => {
  expect(typeof func).toEqual('function');
}

export const shouldRessembleAMaybe = obj => {
  shouldBeAFunction(obj.map);
  shouldBeAFunction(obj.fold);
  shouldBeAFunction(obj.chain);
};

export const shouldRessembleEither = obj => {
  shouldBeAFunction(obj.map);
  shouldBeAFunction(obj.fold);
};

export const shouldBeAMaybe = obj => {
  shouldRessembleAMaybe(obj);
  let total = 0;
  const res = obj.map(() => total += 1).map(() => total += 1);
  shouldRessembleAMaybe(res);
  expect(total).toEqual(2);
};

export const shouldBeNothing = obj => {
  shouldRessembleAMaybe(obj);
  const mock = jest.fn();
  obj.map(mock);
  expect(mock.mock.calls.length).toEqual(0);
};

export const getCalls = mockFn => mockFn.mock.calls.length;

export const shouldRessembleALens = lens => {
  shouldBeAFunction(lens);
  shouldBeAFunction(lens().get);
  shouldBeAFunction(lens().set);
};
