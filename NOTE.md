# Functional Programming

## Function composition

Passing a result of a Mathematical function passed to another mathematical function

```javascript
    const compose = (g, f) =>
        x => g (f(x));

    const toUpper = x => x.toUpperCase();
    const removeSpaces = x => x.trim();

    const cleanString = compose(toUpper, remoceSapces);

    console.log(cleanString('   AntoNiO  '));
```

## What's a pure function?

For every value of X you get a value of Y => it's a pure function

If you have multiple values or unpredictable function => we will not consider it, it's not a pure function

### Not considered as a "function"

```javascript
    let x = 0;

    const add1 = () => x += 1;
    const multBy2 = () => x *= 2;
```

Because it could give unpredictive result, it's mutating x

### A function should mutate anything and must be predictable

```javascript
    let x = 0;

    const add1 = y => y + 1;
    const multBy2 =y => y * 2;
    const addThenMult = compose(add1, multBy2);
```

## Immutability

Do not change something

Once you create a value you're not gonna update it.

### Mutating

```javascript
    const getOlder = person => person.age++;
```
Is not immutable

### Immutable way

```javascript
    const getOlder = person => ({
        ...person,
        age: person.age + 1
});
```

*no body so return the first expression which is ();*
*{} create an object*
*... destructuring gives you all the properties*
*age: person.age + 1 // to override the age value*

```javascript
    const addAntonioArray = (arr) => [...arr, 'Antonio'];
```

**Why immutability?**

* Always the same result!
* Testable!
* Predictable!

## Exercice on something really horrible

**goal**
```javascript
    const doubleNumbers = (arr = []) => arr.map(number => number * 2);
```

*this is declarative*
*you don't tell the computer how to get there*

## Why should you care about f() programming?

0. Declarative
1. When you build something, it's easy to reason it, to break down in small pieces and get everything together
2. easy to apply in d2d code
3. Testable, testing return always the same thing, all the context is in the arguments

*It's just a bunch of concept*
*Use const + Object.freeze() everywhere*

Functional language that can compile to javascript l, camel

## More

### Lazybox

#### Boxes

Box is just a function that take a value and return an object

```JavaScript
    const Box = value => [value]
```
Boxing is elevating to another type.

Now we can
```JavaScript
    Box(32).map(x => x * 2).map(x => 'Your num is '+x).forEach(console.log)
```

If we do it on our own (without using arrays) we need to implement **map** and **fold** correctly (returning a Box)

```JavaScript
    const Box = value => ({
        map: func => Box(func(value)),
        fold: (func = x => x) => func(value)
    });

    const result = Box(' fsdf dsfqsd,f qdsf sdfqsdf ')
    .map(x => x.trim())
    .map(x => x.toLowerCase())
    .map(x => x.replace(/\,|\./g, ''))
    .fold()

    console.log(result)
```

What if you don't want it executed righ away ==> Lazy boxes

#### Lazybox

We can do expensive things in map and it will not be executed until you fold

```JavaScript
    const compose = (f, g) =>
        (...args) => f(g(...args))
    
    const LazyBox = func => ({
        map: g => LazyBox(compose(func, g)),
        fold: g => compose(func, g)()
    });

    const result = LazyBox(() => 'Hello')
    .map( x => {
        message: x
    })
    .fold()

    console.log(result)
```

### Right, Left, Either

If you have a method that do something and you want people to properly handle error and success.

Right and left have the same API: map, fold

fold takes 2 functions:

- handle errors
- handle success

```JavaScript
    function fetchFromServe(url) {
        const res = null;
        /** magic here **/
        return either(res);
    }

    function error() {
        console.log('error');
    }

    function success() {
        console.log('success');
    }

    function tryCatch(task) {
        try {
            return right(task)
        } catch(e) {
            return left(e)
        }
    }

    fetchFromServer('something').fold(
        error, success
    )

    // become
    tryCatch(fetchFromServer).fold(error, success)
```

See: egghead.io Professor Frisby