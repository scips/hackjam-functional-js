# HackJam Functional JS
Welcome, Hackers!

This HackJam will be all about writing functional code. You'll write your very own functional JS library.

## Getting Started
```Bash
git clone https://github.com/hackages/hackjam-functional-js.git
cd hackjam-functional-js
npm run test
# Open lib/index.js in your favorite code ditor and start Hacking ;)
```
## Some concepts before we start
### Higher Order Functions
An higher order function (I feel smart just writting this) is a function that returns a function.
Example:
```JavaScript
const add = (x) => (y) => x + y;
const addTwo = add(2);
console.log(addTwo); // [Function]
console.log(addTwo(5)); // 7
```
### Closure
A closure is a persistent scope which holds on to local variables even after the code execution has moved out of that block.

Example:
```JavaScript
const sayHello = name => message => `${message}, ${name}!`;
const antonioSays = sayHello('Antonio');

/**
Some buisness logic here
**/
antonioSays('Hello'); // <-- Our function still has access to 'Antonio';
```

### Box
A box is just a container, you give it a value then you can do things like map or fold it.
During this HackJam you'll run into Boxes a lot, LazyBox, Left, Right are all some variation of a Box.
Example:
```JavaScript
const Box = value => ({
    map: f => Box(f(value)),
    fold: f => f(value),
    inspect: () => `Box(${value})`
});
const res = Box(3).map(x => x * 2);
console.log(res); // Box(6)
console.log(res.fold(x => x)); // 6
```
TODO: Complete this section

## Exercices
### 01. Compose
Function composition is a really simple principle, it's the fact of "composing" multiple small functions into a bigger one.

Let's take the following example:
```JavaScript
const upperCase = x => x.toUpperCase();
const trim = x => x.trim();

const cleanString = compose(upperCase, trim);

const name = '       aNtonio   ';
console.log(cleanString(name)); // 'ANTONIO'
```
We create two small and very simple functions and we used composition to build an other one out of those two functions, this gives us the power to break complicated problems into smaller elements.

Theory: Compose applies the function from right to left

eg: *compose(upperCase, trim)* is going to call trim then upperCase.

### 02. Pipe
Pipe works kind of like compose, it takes an infinite number of functions in parameters and returns a function that is going to apply the functions received from left to right.

For example:
```JavaScript
const split = x.split(' ');
const lowerCase = x => x.map(e => e.lowerCase());
const join = = x.join('-');

const uriSlug = pipe(split, lowerCase, join);
const res = uriSlug('Functional JavaScript Rocks!');
console.log(res); // 'functional-javascript-rocks'
```
Just like with compose, we created a small set of functions and we call each one of them on the input it receives.

Side note: In JavaScript you can pass an unlimited numbers of parameters to a function using the following syntax:
```JavaScript
const add = (...numbers) => 
    numbers.reduce((acc, next) => acc + next, 0);
console.log(add(1, 5, 2, 3)); // 11
```

### 03. Curry
Currying is really simple, it's the fact of pre-passing arguments to a function.

Say we have a function *add* that takes two parameters and then returns the result of those parameters, well using currying we could do the following:
```Javascript
const add = (x, y) => x + y;
const addTwo = curry(add, 2);
console.log(addTwo(5)); // 7
```

Our curry function will take 2 to infinity parameters.
The first parameter will be the function we can to curry, the next parameters will be all the parameters we want to pre-pass to our function.

Second example:
```JavaScript
const add = (...numbers) => 
    numbers.reduce((acc, next) => acc + next, 0);
const addTwoFiveAndWhatever = curry(add, 2, 5);

console.log(addTwoFiveAndWhatever(10)); // 17
```

### 04. LazyBox
A lazy box works just like a box except that it takes a function as a parameter instead of a value.
It only evaluates the value return from thatfunction when we call fold on it.

When called, it should return an object with two functions, map and fold.

It allows us to pre-create a of instructions and only evaluates them when needed. 

Usage example:
```JavaScript
const mockUser = {
    name: Antonio
}
const extractName = () => mockUser.name;
lazyBox(extractName)
    .map(x => x.toUpperCase)
    .map(x => x.split(''))
    .map(x => x.reverse())
    .map(x => x.join('')); // <- At this point none of the functions have been computed
    .fold(console.log); // <- We compute everything when calling .fold
```

### 05. Either
Either or is a left or a right. It forces error checking, allows code branching, ...
```JavaScript
// Say we create a Right:
const res = Right(64);

// We can map over it
console.log(res.map(n => `Your number is ${n}`)); // Right('Your number is 64')

// We can fold it
const value = res.fold(err => console.log(err), // If res was a left it'd call this function
                       n => n);                 // But since it's gonna call our identity function
/**
* Let's see a case where res is a left
**/
let res = Left(64);
res = res.map(x => x * 2); // This is just going to return Left(64) without calling the functor we passed to the map
console.log(res.fold(console.log, () => 'This function will never be called'));
```
Since we don't know if we're going to receive a left or a right we must provide two functions to the fold, one to handle errors and the other one to handle cases where everything goes right (see what I did there).

#### It allows us to do things like
```JavaScript
const conf = {
    host: 'localhost',
    port: 3000
};
const getPort = confObj => {
    if(confObj.port){
        return right(confObj.port);
    } else {
        return left();
    }
}
const port = getPort(conf).fold(() => 5000, port => port);

/*
* An other example
*/
const defaultConf = {
/** Some conf here **/
};
const tryCatch = f => {
    try {
        return right(f());
    } catch (e) {
        return left(e);
    }
}
tryCatch(() => fs.readFileSync('conf.json'))
    .fold(err => defaultConf, conf => conf);
```

Finally, the Either function.
This one should be fairly simple, it checks whether the value you gave it is defined and then returns a left or a right.
Examples:
```JavaScript
either(0); // --> left
either(); // --> left
either(42); // --> right
either([]); // --> right
either(''); // --> left
```

### 06. Maybe ... 
Maybe we'll get a value, maybe we won't 🤔
Maybe allows you to safely check null or undefined values and execute actions when they're not or undefined

Example:
```JavaScript
const user = {};
const country = Maybe(user.country)
    .chain(either)
    .fold(() => 'Belgium', identity);
console.log(country); // 'Belgium';
```

You can, for example, replace codes where you do the following:
```JavaScript
if(obj && obj.test && obj.test.company && obj.test.company.lalala){
    /**
    * Some business logic
    **/
} else {
    /**
    * Error handling
    **/
}
```
with
```JavaScript
maybe(obj)
    .map(prop('test'))
    .map(prop('company'))
    .map(prop('lalala'))
    .map(someLogicWhenTheresAValue)
    .chain(either)
    .fold(err, success)
```

### 07. Lenses
Lenses are functional getter and setters, they allow us to get and set values in objects in a functional way.

When we try to set a value in an object in functional programming, since everything is immutable we don't want to create update existing values, we want to create new ones.

Example:
```JavaScript
const getter = obj => obj.name;
const setter = (value, obj) => ({...obj, name: value});

const nameLens = lens(getter, setter);

const mockUser = {
    name: 'Antonio',
    id: 42
};

nameLens.get(mockUser); // 'Antonio'
nameLens.set('Bob', mockUser); // {name: 'Bob', id: 42}


// You can also use a lensProp directly
const nameLens = lensProp('name');

const mockUser = {
    name: 'Antonio',
    id: 42
};

nameLens.get(mockUser); // 'Antonio'
nameLens.set('Bob', mockUser); // {name: 'Bob', id: 42}

// You might also want to use lensIndex
const first = lensIndex(0);
first.get([1, 3, 2]); // 1
first.set(42, [1, 3, 3]); // [42, 3, 3]
```

### 08. Range
The range gives you back a range of numbers, as simple as that.

Example usage:
```JavaScript
range(2); // [0, 1]
range(2, 5); // [2, 3, 4]
range(2, -3); // [2, 1, 0, -1, -2]
```
